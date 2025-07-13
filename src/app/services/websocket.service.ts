// src/app/services/websocket.service.ts
import { Injectable } from '@angular/core';
import Echo from 'laravel-echo';
import { environment } from '../environments/environment';
import { Observable, Subject } from 'rxjs';

// ¡IMPORTA PUSHER.JS DIRECTAMENTE!
import Pusher from 'pusher-js';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  // ¡CAMBIO CLAVE AQUÍ: Usar 'any' para el tipo genérico de Echo!
  // Esto relaja la restricción de tipo y permite que la compilación proceda.
  private echo: Echo<any>;
  private eventSubjects: { [key: string]: Subject<any> } = {};

  constructor() {
    // CRUCIAL: Asignar Pusher a window.Pusher para que Laravel Echo pueda encontrarlo.
    (window as any).Pusher = Pusher;

    this.echo = new Echo({
      broadcaster: 'reverb', // Sigue siendo 'reverb' para conectar a tu servidor Reverb
      key: environment.reverb.app_key,
      wsHost: environment.reverb.ws_host,
      wsPort: environment.reverb.ws_port,
      wssPort: environment.reverb.wss_port,
      forceTLS: environment.reverb.forceTLS,
      disableStats: environment.reverb.disableStats,
      enabledTransports: ['ws', 'wss'],
      // Opciones adicionales si las necesitas:
      // authEndpoint: 'http://localhost:8000/api/broadcasting/auth',
    });

    console.log('Laravel Echo (con Reverb) inicializado:', this.echo);

    // Escuchar el estado de la conexión para depuración
    this.echo.connector.pusher.connection.bind(
      'state_change',
      (states: any) => {
        console.log('Echo connection state changed:', states.current);
      }
    );
    this.echo.connector.pusher.connection.bind('connected', () => {
      console.log('Echo CONECTADO a Reverb! ✅');
    });
    this.echo.connector.pusher.connection.bind('disconnected', () => {
      console.warn('Echo DESCONECTADO de Reverb! ⚠️');
    });
    this.echo.connector.pusher.connection.bind('error', (err: any) => {
      console.error('Echo error en la conexión:', err);
    });
  }

  listen(channelName: string, eventName: string): Observable<any> {
    const fullEventName = `${channelName}.${eventName}`;
    if (!this.eventSubjects[fullEventName]) {
      this.eventSubjects[fullEventName] = new Subject<any>();
      this.echo.channel(channelName).listen(eventName, (data: any) => {
        console.log(`Evento '${fullEventName}' recibido:`, data);
        this.eventSubjects[fullEventName].next(data);
      });
    }
    return this.eventSubjects[fullEventName].asObservable();
  }
}

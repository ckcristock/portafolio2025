// src/app/interceptors/api.interceptor.ts
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse, // Para manejar respuestas exitosas
  HttpErrorResponse, // Para manejar respuestas de error
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators'; // Operadores de RxJS

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  // Puedes usar un servicio aquí para controlar un spinner global
  // Por ejemplo: private loadingService: LoadingService
  private activeRequests = 0; // Contador de peticiones HTTP activas

  constructor() {} // Inyecta servicios si los necesitas (ej. para notificaciones, loading spinner)

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    // Incrementa el contador de peticiones activas
    this.activeRequests++;
    // Aquí podrías mostrar un spinner global o una barra de progreso
    console.log('Petición HTTP iniciada:', request.url);

    return next.handle(request).pipe(
      // 'tap' se usa para observar valores emitidos por el Observable
      tap((event: HttpEvent<unknown>) => {
        if (event instanceof HttpResponse) {
          // Petición completada con éxito
          console.log('Respuesta HTTP exitosa:', event.url, event.status);
          // Puedes añadir lógica para manejar respuestas exitosas globalmente
        }
      }),
      // 'catchError' se usa para manejar errores de la petición
      catchError((error: HttpErrorResponse) => {
        console.error('Error HTTP:', error.url, error.status, error.message);
        let errorMessage = 'Ocurrió un error desconocido.';

        if (error.error instanceof ErrorEvent) {
          // Error del lado del cliente o de la red
          errorMessage = `Error: ${error.error.message}`;
        } else {
          // El backend retornó un código de respuesta de error (4xx, 5xx)
          switch (error.status) {
            case 400:
              errorMessage =
                'Solicitud incorrecta. Verifique los datos enviados.';
              break;
            case 404:
              errorMessage = 'Recurso no encontrado.';
              break;
            case 500:
              errorMessage =
                'Error interno del servidor. Inténtelo de nuevo más tarde.';
              break;
            default:
              errorMessage = `Error del servidor: ${error.status} - ${error.message}`;
          }
        }

        // Aquí podrías usar un servicio de notificación (ej. MatSnackBar)
        alert(`Error en la API: ${errorMessage}`); // Por simplicidad, usamos alert()

        // Re-lanza el error para que los suscriptores (tus componentes/servicios) lo manejen también si es necesario
        return throwError(() => new Error(errorMessage));
      }),
      // 'finalize' se ejecuta cuando el Observable completa o se produce un error
      finalize(() => {
        // Decrementa el contador de peticiones activas
        this.activeRequests--;
        // Si no hay más peticiones activas, podrías ocultar el spinner global
        if (this.activeRequests === 0) {
          console.log('Todas las peticiones HTTP finalizadas.');
          // Aquí podrías ocultar el spinner global
        }
      })
    );
  }
}

// src/app/interceptors/api.interceptor.ts
import {
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
  HttpInterceptorFn,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';

// Contador de peticiones activas (fuera de la función para mantener el estado)
let activeRequests = 0;

// Exportamos una constante que es la función interceptora
export const ApiInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  // Incrementa el contador de peticiones activas
  activeRequests++;
  console.log('Petición HTTP iniciada:', req.url);

  return next(req).pipe(
    // Corregido: antes tenías next.handle(req), ahora solo next(req)
    tap((event: HttpEvent<unknown>) => {
      if (event instanceof HttpResponse) {
        console.log('Respuesta HTTP exitosa:', event.url, event.status);
      }
    }),
    catchError((error: HttpErrorResponse) => {
      console.error('Error HTTP:', error.url, error.status, error.message);
      let errorMessage = 'Ocurrió un error desconocido.';

      if (error.error instanceof ErrorEvent) {
        errorMessage = `Error: ${error.error.message}`;
      } else {
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

      alert(`Error en la API: ${errorMessage}`);

      return throwError(() => new Error(errorMessage));
    }),
    finalize(() => {
      activeRequests--;
      if (activeRequests === 0) {
        console.log('Todas las peticiones HTTP finalizadas.');
      }
    })
  );
};

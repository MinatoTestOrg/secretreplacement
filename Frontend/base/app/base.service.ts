import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { combineLatest, Observable, Observer, of, throwError } from 'rxjs';
import { tap, catchError, map, take } from 'rxjs/operators';
import { AppLoaderService } from './app-loader.service';
import { NotifiactionService } from './notification.service';
import { TranslateService } from '@ngx-translate/core';
import { inject } from '@angular/core';
import { AuthenticationResolver } from '@app/auth/authentication.resolver';
import { Router } from '@angular/router';
import { AuthService } from '@app/auth/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { AppGlobalService } from './app-global.service';
import { BaseAppConstants } from './app-constants.base';

@Injectable({
  providedIn: 'root'
})

export class BaseService {
    private readonly defaultContentType = 'application/json'
  public http = inject(HttpClient);
  private loader = inject(AppLoaderService)
  private notification = inject(NotifiactionService)
  private translateService = inject(TranslateService);
  public router = inject(Router);
  // public auth = inject(AuthService);
  public appGlobalService = inject(AppGlobalService);
  public cookieService = inject(CookieService);
  // private authenticationResolver = inject(AuthenticationResolver)
   

  public get(options: any, params?: any): Observable<any> {
    if (options.showloading) {
      this.loader.show();
    }
    const url = this.normalizeUrl(options.url, params);
    return this.http.get(url).pipe(
      tap(_ => {
        this.loader.hide();
      }),
      catchError((err: any, caught: Observable<any>) => {
        if(options.handleError === false){
          this.loader.hide();
          return throwError(err);
        }
        else{
          // this.handleError(options, err);
          return throwError(this.handleError(options, err));
        }
      })
    );
  }

  public post(options: any, params?: any, data?: any): Observable<any> {  
    if (options.showloading) {
      this.loader.show();
    }
    
    const httpOptions = this.getHttpHeaders(options);
    const url = this.normalizeUrl(options.url, params);
    return this.http.post(url, params, httpOptions).pipe(
      tap(_ => {
        this.loader.hide();
      }),
      catchError((err: any, caught: Observable<any>) => {
        if(options.handleError === false){
          this.loader.hide();
          return throwError(err);
        }
        else{
          // this.handleError(options, err);
          return throwError(this.handleError(options, err));
        }
      })
    );

  }

  public put(options: any, params?: any, data?: any): Observable<any> {
    if (options.showloading) {
      this.loader.show();
    }
    const httpOptions = this.getHttpHeaders(options);
    const url = this.normalizeUrl(options.url, params);
    return this.http.put(url, params, httpOptions).pipe(
      tap(_ => {
        this.loader.hide();
      }),
      catchError((err: any, caught: Observable<any>) => {
        if(options.handleError === false){
          this.loader.hide();
          return throwError(err);
        }
        else{
          // this.handleError(options, err);
          return throwError(this.handleError(options, err));
        }
      })
    );

  }

  public delete(options: any, params?: any): Observable<any> {
    if (options.showloading) {
      this.loader.show();
    }
    const httpOptions = this.getHttpHeaders(options);
    const url = this.normalizeUrl(options.url, params);
    return this.http.delete(url, httpOptions).pipe(
      tap(_ => {
        this.loader.hide();
      }),
      catchError((err: any, caught: Observable<any>) => {
        if(options.handleError === false){
          this.loader.hide();
          return throwError(err);
        }
        else{
          // this.handleError(options, err);
          return throwError(this.handleError(options, err));
        }
      })
    );
  }

  public deletewithBodyParams(options: any, params?: any): Observable<any> {
    if (options.showloading) {
      this.loader.show();
    }
    const httpOptions = this.getHttpHeaders(options);
    const url = this.normalizeUrl(options.url, params);
    
    // If params are provided, include them in the body of the request
    const bodyParams = params ? { ...params } : {}; // Clone params to avoid mutation
    
    return this.http.delete(url, { ...httpOptions, body: bodyParams }).pipe(
      tap(_ => {
        this.loader.hide();
      }),
      catchError((err: any, caught: Observable<any>) => {
        if (options.handleError === false) {
          this.loader.hide();
          return throwError(err);
        } else {
          // this.handleError(options, err);
          return throwError(this.handleError(options, err));
        }
      })
    );
  }

  private normalizeUrl(baseUrl: string, params?: any): string {
     if(BaseAppConstants.contextPath){
      baseUrl = BaseAppConstants.contextPath + baseUrl;
    }
    if (baseUrl.indexOf('{') === -1 || !params) {
      return `${baseUrl}`;
    }
    const splitUrl = baseUrl.split('/');
    let buildUrl:string = '' ;
    
    if (splitUrl.length > 1) {
      let tempUrl: string;
      for (let index = 0, length = splitUrl.length; index < length; index++) {

        tempUrl = splitUrl[index];
        if (!tempUrl) { continue; }

        if (tempUrl[0] === '{' && tempUrl[tempUrl.length - 1] === '}') {

          const param = tempUrl.replace('{', '').replace('}', '');
          const urlParameter = params[param];
          delete params[param];
          if (urlParameter !== undefined && urlParameter != null) {
            buildUrl = buildUrl + '/' + urlParameter;
          }

        } else {

          if (buildUrl[buildUrl.length - 1] !== '/') {
            buildUrl = buildUrl + '/';
          }
          buildUrl = buildUrl + tempUrl;
        }
      }

      
      // return encodeURI(buildUrl);
    }
    return buildUrl;

  }

  public getServiceUrl(url: string) {
    const serviceUrl = this.normalizeUrl(url);
    return serviceUrl;
  }

  private getHttpHeaders(options: any) {

    let contentTypeHeader: string = (options.headers ? options.headers.get('Content-Type') : '');

    if (!contentTypeHeader) {
      contentTypeHeader = this.defaultContentType;
    }

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': contentTypeHeader
      })
    };

    return httpOptions;
  }

  private handleError(options: any, err: any) {
    this.loader.hide();
    const urlarray = (options.url?.split("/"));
    if(err.status == "401" && !(urlarray.includes("user-details"))){
      // location.href = '/logout';
      this.resolve();
    }
    if (err.error instanceof ErrorEvent) {
      /** A client-side or network error occurred. */
      console.error('An error occurred:', err.error.message);
    } else if (options.showErrorMsg !== false) {
      let errorMsg = '';
      if (err.error && err.error.DETAIL) {
        err.error.DETAIL.map((e:any) => {
          errorMsg += `${this.translateService.instant(e.MESSAGE)}`;
        });
      } else if (err.error && err.error.MESSAGE) {
        errorMsg = `${this.translateService.instant(err.error.MESSAGE)}`;
        
      }
       
            if (err.data && err.data.validationErrors && err.data.validationErrors.length) {
              for (err of err.data.validationErrors) {
                errorMsg += `${this.translateService.instant(err.message)}`;
                
              }
            } else if (err.formattedMsg) {
              errorMsg = `${this.translateService.instant(err.formattedMsg)}`;
              
            } else if (err.data && err.data.applicationMessage) {
              errorMsg = `${this.translateService.instant(err.data.applicationMessage)}`;
              
            } 
            // else if (err.error && err.error.MESSAGE) {
            //   errorMsg = err.error.MESSAGE;
            // }

      // if (!errorMsg) {
      //   errorMsg = 'The record couldn\'t be updated. Please try again';
      // }
     if(errorMsg)
      this.notification.showMessage({severity:'error',icon:'', summary:'', detail:errorMsg})
    }
  }

  public getPrototypingData(options: any, params?: any): any {
    if (options.showloading) {
      this.loader.show();
    }
    const url = options.url;

    return this.http.get(url).pipe(
      tap(_ => {
        this.loader.hide();
      }),
      catchError((err: any, caught: Observable<any>) => {
        // this.handleError(options, err);
        return throwError(this.handleError(options, err));
      })
    );
  }

  
  getUrl(url: string, queryString: string): string {
    return url + queryString;
  }
  
  search(url: string, queryString: string): Observable<any> {
    let _URL = this.getUrl(url, queryString);
    return this.http.get(_URL);
  }



  //Login



  public authenticate(): Observable<any> {
    const latest = combineLatest([this.isUserLoggedIn()])
    return latest;
  }


  getUserInfo(params?:any){
    const url = '/rest/applicationusers/user-details';
    const currentUserSubject = new Observable((observer:any) => {
        this.get({url : url,handleError:false}).subscribe(
          (data: any) => {
            observer.next(data);
          },
          (error: any) => {
            observer.error(error);
          }
        );
      });

      return currentUserSubject;
  }

  getLoginMethod() {
    const currentUserSubject = new Observable((observer: any) => {
      this.get({ url: '/rest/login-providers/oauth-login-providers', handleError:false}).subscribe(
        (data: any) => {
          const url = data.login_urls[0];
          this.redirectToLogin(url).subscribe((res) => {
            observer.next(data);
            observer.complete();
          }, (error: any) => {
            observer.error(error);
            observer.complete();
          })
        },
        (error: any) => {
          observer.error(error);
          observer.complete();
        }
      );
    });

    return currentUserSubject;
  }


  
  redirectToLogin(url:any): Observable<boolean> {
    return Observable.create((obsr$: Observer<boolean>) => {
      window.location.href = `${window.location.origin}${url}`;
    })
  }


  isUserLoggedIn(): Observable<boolean> {
    const isUserLoggedIn = this.cookieService.get('RAPPL');
    return Observable.create((obsr$: Observer<boolean>) => {
      if (isUserLoggedIn == 'yes') {
        obsr$.next(true);
        obsr$.complete();
      }
      else {
        this.getLoginMethod().subscribe(()=>{
          obsr$.next(true);
          obsr$.complete();
        },(err:any)=>{
          obsr$.error('authentication failed');
          obsr$.complete();
        })
       
      }

    })
  }

  resolve() {
    this.authenticate().subscribe((res)=>{
      this.appGlobalService.write('currentUser', res[1]);
    },(err:any)=>{})

    // this.authenticate().pipe(map((res: any[]) => {
    //   this.appGlobalService.write('currentUser', res[1]);
    // }),
    //   take(1),
    //   catchError((error) => {
        // const isUserLoggedIn = this.cookieService.get('RAPPL');
        // if(isUserLoggedIn == 'yes' && !this.appGlobalService.get('currentUser')){
        //   let redirectUrl = window.location.hash;
        //   let loginUrl = '/login';
        //   if (redirectUrl.indexOf("login") == -1) {
        //     loginUrl += "?redirectUrl=" + encodeURIComponent(redirectUrl);
        //   }
        //   this.router.navigateByUrl(loginUrl);
        // }
        // else{
        //   let redirectUrl = window.location.hash;
        //   let loginUrl = '/login';
        //   if (redirectUrl.indexOf("login") == -1) {
        //     loginUrl += "?redirectUrl=" + encodeURIComponent(redirectUrl);
        //   }
        //   this.router.navigateByUrl(loginUrl);
        // }
      //   return of(false);
      // }))
  }

}

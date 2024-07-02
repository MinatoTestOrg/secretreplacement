import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AppLayoutBaseService } from '@baseapp/app-layout/app-layout.service.base';
import { PrototypeVariables } from './auth/prototype.variables';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { environment } from '@env/environment';
import { LoaderService } from './loader.service';
import { inject } from '@angular/core';
import { AuthService } from '@app/auth/auth.service';

export class AppBaseComponent {
  title = '';
  blocked = false;
  //appId : string = PrototypeVariables.APP_ID;
  //prototypeUrl = new URL(PrototypeVariables.DESIGN_STUDIO_URL).origin;
  //url: string = `${this.prototypeUrl}?appId=${this.appId}`;
  isPrototype = environment.prototype;
  isAuthenticated:boolean = false;
  //safeSrc: SafeResourceUrl | undefined;
  public translate = inject(TranslateService)
  public bs = inject(AppLayoutBaseService) 
  public sanitizer = inject(DomSanitizer)
  public loaderService= inject(LoaderService)
  public authService = inject(AuthService);
 

  onInit(): void {
    this.checkAuth();
    this.translate.use('en')
    this.bs.setAppTitle();
    this.bs.setAppLogo();
    this.loaderService.spinnerChanges.subscribe(res=>{
      this.blocked = res;
    })

    //this.url = this.url.replace("http://", "https://");
    //this.safeSrc =  this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
    
  
  }
  checkAuth(){
    if(environment.prototype){
      this.isAuthenticated = true;
    }
    else if(window.location.hash === '#/logout' ||window.location.hash.split('?')[0] === '#/error'){
      this.isAuthenticated = true
    }
    else{
      this.authService.authChanges.subscribe((res:any)=>{
        this.isAuthenticated  = res;
      })
    }
    
  }
}

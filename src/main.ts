import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app';
import { appConfig } from './app/app.config';
import { provideAnimations } from '@angular/platform-browser/animations';

bootstrapApplication(AppComponent, {
  providers: [
    ...appConfig.providers,   // ✅ KEEP existing providers
    provideAnimations()       // ✅ ADD animations
  ]
}).catch(err => console.error(err));
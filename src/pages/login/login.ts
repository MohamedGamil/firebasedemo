import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';

import { HomePage } from '../home/home';
import { RegisterPage } from '../register/register';

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

import { LoadingProvider } from '../../providers/loading/loading';


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

	userData:any;
	loginData = { email:'', password:'' };
	authForm : FormGroup;
	email: AbstractControl;
	password: AbstractControl;

  constructor(public toastCtrl: ToastController, public fb: FormBuilder, public navCtrl: NavController, public navParams: NavParams, public afAuth: AngularFireAuth,public loadingProvider: LoadingProvider) {

  	this.authForm = this.fb.group({
      'email' : [null, Validators.compose([Validators.required])],
      'password': [null, Validators.compose([Validators.required])],
    });

        this.email = this.authForm.controls['email'];
        this.password = this.authForm.controls['password'];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

/*------------------

ionic_3 & Firebase_auth_v5.0

Firebase : email - johnnyharpertesting2@gmail.com
		   App name - FirebaseAuth

facebook : email - johnnyharpertesting@gmail.com
		   App name - FirebaseAuth

--------------------*/

// For User Login

  userLogin(loginData){
    this.loadingProvider.startLoading();
  	console.log('loginData',loginData);
  		this.afAuth.auth.signInWithEmailAndPassword(loginData.email, loginData.password)
        .then(result => {
          this.loadingProvider.stopLoading();
          this.moveToHome(result);
        }).catch(err => {
          this.loadingProvider.stopLoading();
          console.log('err',err);
          this.presentToast(err);
        });
  }


// For Social Login

  socialLogin(isLogin){

  	console.log(isLogin);

  	if (isLogin == "facebook"){
  		this.afAuth.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider())
      	.then(res => {
      		 this.moveToHome(res.user);
      	})
      	.catch(err => console.log('err',err));
  	}else if(isLogin == "google"){
  		this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
      	.then(res => {
      		 this.moveToHome(res.user);
      	})
      	.catch(err => console.log('err',err));
  	}else if(isLogin == "twitter"){
  		this.afAuth.auth.signInWithPopup(new firebase.auth.TwitterAuthProvider())
      	.then(res => {
      		 this.moveToHome(res);
      	})
      	.catch(err => console.log('err',err));
  	}else if(isLogin == "github"){
  		this.afAuth.auth.signInWithPopup(new firebase.auth.GithubAuthProvider())
      	.then(res => {
      		 this.moveToHome(res);
      	})
      	.catch(err => console.log('err',err));
  	}

  }

  // Move to register page
  moveToRegister(){
  	this.navCtrl.setRoot(RegisterPage);
  }

  //Move to Home Page
  moveToHome(res){
  	console.log('res',res);
  	this.navCtrl.setRoot(HomePage,{res:res});
  }

  presentToast(err) {
  const toast = this.toastCtrl.create({
    message: err.message,
    duration: 3000,
    position: 'bottom'
  });

  toast.present();
}

}

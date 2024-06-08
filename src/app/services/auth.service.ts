export class AuthService {
  isAuth: boolean = false;

  constructor() {}

  signIn() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        this.isAuth = true;
        const desc = document.getElementById('deco');
        const auth = document.getElementById('auth');
        if (desc) {
          desc.style.display = 'block';
        }
        if (auth) {
          auth.style.display = 'none';
        }
        resolve(true);
      }, 2000);
    });
  }

  signOut() {
    this.isAuth = false;
    const desc = document.getElementById('deco');
    const auth = document.getElementById('auth');
    if (desc) {
      desc.style.display = 'none';
    }
    if (auth) {
      auth.style.display = 'block';
    }
  }
}

export default class AuthService {
  async login(email: string, password: string) {
    const response = await fetch("http://147.93.114.138:8240/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    debugger
    return response.json();
    }
  }

export default class AuthService {
  async login(email: string, password: string) {
    const response = await fetch("http://localhost:3333/login", {
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

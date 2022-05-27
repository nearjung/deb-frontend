import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Tokens } from '../model/tokens';
import { ConfigServerService } from '../core/config-server.service';

@Injectable({
    providedIn: 'root'
})

export class AuthService {
    _apiCojUserServer: string;
    header: HttpHeaders
    option: any = {}
    private JWT_TOKEN = 'JWT_TOKEN';
    // private readonly REFRESH_TOKEN = 'REFRESH_TOKEN';
    private loggedUser: string;

    constructor(private httpClient: HttpClient, private configService: ConfigServerService) {
        this.header = new HttpHeaders().set("Content-Type", "application/json; charset=UTF-8");
        this.option.headers = this.header;
    }

    login(data: any) {
        return this.httpClient.post<any>(this.configService.getAPI('syuser/login'), data, { observe: 'response' }).pipe(
            map(response => {
                if (response.body.value) {
                    let token: string[] = (response.headers.get("Authorization")) ? response.headers.get("Authorization").split(" ") : null;
                    if (token?.length > 1) {
                        this.doLoginUser(data?.email, {
                            jwt: token[1], refreshToken: ""
                        });
                    }
                }
                return {
                    serviceResult: response.body
                }
            })
        );
    }

    logout() {
        this.doLogoutUser();
    }

    private doLoginUser(username: string, tokens: Tokens) {
        this.loggedUser = username;
        this.storeTokens(tokens);
    }

    private storeTokens(tokens: Tokens) {
        localStorage.setItem(this.JWT_TOKEN, tokens.jwt);
    }

    isLoggedIn() {
        return !!this.getJwtToken();
    }

    getJwtToken() {
        return localStorage.getItem(this.JWT_TOKEN);
    }

    private doLogoutUser() {
        this.loggedUser = null;
        this.removeTokens();
    }

    private removeTokens() {
        localStorage.removeItem(this.JWT_TOKEN);
    }

}
import { ComponentFixture } from "@angular/core/testing";
import { DebugElement, Injector, ReflectiveInjector } from "@angular/core";
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { ActivatedRoute } from "@angular/router/router";
import { Observable } from "rxjs/Rx";
import { TestBed } from "@angular/core/testing";;
import { InstanceService } from "../../../shared/services/instance.service";
import { AccountLoginService } from './accountLogin.service'
import { AccountLoginMockService } from './accountLogin.service.mock'
import { Router } from "@angular/router";
import { UserDetail } from "app/pages/accountLogin/accountLoginService/accountLogin.model";
import { tick } from "@angular/core/testing";


describe('Account Login Service', () => {
    let accountLoginService: AccountLoginService, instanceService: InstanceService, injector: Injector,
        mockAccountLoginService: AccountLoginMockService
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                AccountLoginService, AccountLoginMockService, InstanceService,Router
            ],
            imports : [
            ]
        });
    })

    beforeEach(() => {
        const injector = ReflectiveInjector.resolveAndCreate([InstanceService]);
        instanceService = injector.get(InstanceService);
        accountLoginService = new AccountLoginService(instanceService);
    })

    // it('should login user', () => {
    //     let userDetails = { userName: "intershop@123.com", password: "123456" };
    //     accountLoginService.singinUser(userDetails).subscribe((data) => {
    //         expect(accountLoginService.isAuthorized()).toBe(true);
    //     })
    // })

    // it('should logout user', ()=> {
    //     accountLoginService.logout();
    //     expect(accountLoginService.isAuthorized()).toBe(false);
    // })

    // it(`shouldn't login user as the credentials passed are incorrect`, ()=> {
    //     let userDetails = { userName: "intershop@123.com", password: "wrong" };
    //     accountLoginService.singinUser(userDetails).subscribe((data) => {
    //         expect(accountLoginService.isAuthorized()).toBe(false);
    //     })
    // })
});

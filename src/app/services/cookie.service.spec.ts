import { TestBed } from '@angular/core/testing';

import { CookieService } from './cookie.service';

describe('Cookie service', () => {

    let cookieService: CookieService;

    beforeEach(() => {
        TestBed.configureTestingModule({
          providers: [
            CookieService,
          ]
        });
        deleteAllCookies();
        cookieService = TestBed.inject(CookieService) as CookieService;
    });

    function deleteAllCookies() {
        const cookies = document.cookie.split(';');
        for (const cookie of cookies) {
            const eqPos = cookie.indexOf('=');
            const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
            document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT';
        }
    }

    it('Should set, get and delete a cookie appropriately.', () => {

        const testObj = { test_property: 'Test value', test_array: [1, 2, 3]};
        const cookieName = 'test';

        expect(cookieService.getCookie(cookieName)).toBe('');

        cookieService.setCookie(cookieName, JSON.stringify(testObj), 1);

        expect(cookieService.getCookie(cookieName)).toBe(JSON.stringify(testObj));

        cookieService.deleteCookie(cookieName);

        expect(cookieService.getCookie(cookieName)).toBe('');
    });
});

/*
 * Copyright 2015-2025 Ritense BV, the Netherlands.
 *
 * Licensed under EUPL, Version 1.2 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://joinup.ec.europa.eu/collection/eupl/eupl-text-eupl-12
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {Subject} from 'rxjs';
import {ValtimoOcrConfig} from '../../models';
import {ValtimoOcrConfigurationComponent} from './valtimo-ocr-configuration.component';

const CONSOLE_METHODS: Array<keyof Console> = [
    'log',
    'info',
    'warn',
    'error',
    'debug',
    'trace',
    'dir',
    'table',
    'group',
    'groupCollapsed',
];

const TOKEN = 'mistral-api-key-do-not-log-me';

const CONFIGURATION: ValtimoOcrConfig = {
    configurationId: 'a5a3a0e5-0f9d-4c2f-9a2a-1f0f6a3f2f11',
    configurationTitle: 'Valtimo OCR Plugin',
    url: 'https://api.mistral.ai',
    token: TOKEN,
};

describe('ValtimoOcrConfigurationComponent', () => {
    let component: ValtimoOcrConfigurationComponent;
    let consoleSpies: Map<keyof Console, jasmine.Spy>;

    beforeEach(() => {
        component = new ValtimoOcrConfigurationComponent();
        consoleSpies = new Map(
            CONSOLE_METHODS.map(method => [method, spyOn(console, method as never)])
        );
    });

    const assertNothingLogged = (): void => {
        consoleSpies.forEach((spy, method) => {
            const args = spy.calls.allArgs();

            expect(args.length)
                .withContext(
                    `console.${method} was called with: ${JSON.stringify(args)}. The plugin ` +
                    `configuration contains the Mistral API key and must never be written to ` +
                    `the browser console (CWE-532).`
                )
                .toBe(0);
        });
    };

    it('does not log the configuration when the form value changes', () => {
        component.formValueChange(CONFIGURATION);

        assertNothingLogged();
    });

    it('does not log the api key while an administrator types it', () => {
        // The form emits a value change on every keystroke, so the whole configuration - api key
        // included - would be written to the console once per typed character.
        for (let length = 1; length <= TOKEN.length; length++) {
            component.formValueChange({...CONFIGURATION, token: TOKEN.substring(0, length)});
        }

        assertNothingLogged();
    });

    it('does not log an incomplete configuration either', () => {
        component.formValueChange({
            configurationId: '',
            configurationTitle: '',
            url: '',
            token: '',
        });

        assertNothingLogged();
    });

    it('still reports the configuration as valid and emits it on save', () => {
        const save$ = new Subject<void>();
        const validEvents: boolean[] = [];
        const emittedConfigurations: unknown[] = [];

        component.save$ = save$;
        component.valid.subscribe(valid => validEvents.push(valid));
        component.configuration.subscribe(configuration =>
            emittedConfigurations.push(configuration)
        );
        component.ngOnInit();

        component.formValueChange(CONFIGURATION);
        save$.next();

        expect(validEvents).toEqual([true]);
        expect(emittedConfigurations).toEqual([CONFIGURATION]);
        assertNothingLogged();
    });

    it('does not report an incomplete configuration as valid', () => {
        const validEvents: boolean[] = [];

        component.valid.subscribe(valid => validEvents.push(valid));

        component.formValueChange({...CONFIGURATION, token: ''});

        expect(validEvents).toEqual([false]);
    });
});

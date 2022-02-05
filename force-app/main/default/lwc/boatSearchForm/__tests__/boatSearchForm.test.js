import { createElement } from 'lwc';
import BoatSearchForm from 'c/boatSearchForm';

describe('c-boat-search-form', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('displays combobox label', () => {
        const element = createElement('c-boat-search-form', {
            is: BoatSearchForm
        });

        document.body.appendChild(element);

        const combobox = element.shadowRoot.querySelector('lightning-combobox');

        expect(combobox.label).toBe('Status');
    });
});
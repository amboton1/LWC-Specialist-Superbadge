import { createElement } from 'lwc';
import BoatTile from 'c/boatTile';

const BOAT_DATA = {
    "Name": "Sounders",
    "Description__c": "Life without a boat is not fun. I love this boat.",
    "Geolocation__Latitude__s": 47.630068,
    "Geolocation__Longitude__s": -122.335491,
    "Picture__c": "/resource/Houseboats/houseboat6.jpg",
    "Contact__c": "0037Q0000022BjTQAU",
    "BoatType__c": "a017Q00000HMQy5QAH",
    "Length__c": 20,
    "Price__c": 393000,
    "Id": "a027Q0000012LlrQAE",
    "Contact__r": {
        "Name": "Emanuel Manzanares",
        "Id": "0037Q0000022BjTQAU"
    },
    "BoatType__r": {
        "Name": "High Performance",
        "Id": "a017Q00000HMQy5QAH"
    }
}

describe('c-boat-tile', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('compares tile names', () => {
        const element = createElement('c-boat-tile', {
            is: BoatTile
        });
        
        element.boat = BOAT_DATA;

        document.body.appendChild(element);

        const tileName = element.shadowRoot.querySelector('h1');

        expect(tileName.textContent).toBe('Sounders');

    });
});
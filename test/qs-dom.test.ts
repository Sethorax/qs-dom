import $$ from "../src/qs-dom";

const setHTML = () => {
    document.body.innerHTML = `
    <header class="header">
        <ul class="navigation">
            <li class="link">Link 1</li>
            <li class="link">Link 2</li>
            <li class="link">Link 3</li>
        </ul>
    </header>
    <main class="content">
        <div class="text-content">
            <p>Simple paragraph!</p>
        </div>
        <div>
            <nav class="navigation"></nav>
        </div>
    </main>`;
};

describe('QSDom general', () => {
    beforeEach(() => {
        setHTML();      
    });

    it('should construct with selector string', () => {
        const qsdom = () => $$('.link');

        expect(qsdom).not.toThrowError();
        expect(qsdom().$).not.toBeNull();
        expect(qsdom().length).toBe(3);
    });

    it('should construct with NodeList', () => {
        const nodeList = document.querySelectorAll('.link');
        const qsdom = () => $$(nodeList);

        expect(qsdom).not.toThrowError();
        expect(qsdom().$).not.toBeNull();
        expect(qsdom().length).toBe(3);
    });

    it('should construct with HTMLElement', () => {
        const element = document.getElementsByClassName('.link')[0];

        if (element instanceof HTMLElement) {
            const qsdom = () => $$(element);
    
            expect(qsdom).not.toThrowError();
            expect(qsdom().$).not.toBeNull();
            expect(qsdom().length).toBe(1);
        }
    });

    it('should throw error if constructed with wrong argument', () => {
        const qsdom = () => $$(undefined);

        expect(qsdom).toThrowError();
    });

    it('should have correct length depending on match count', () => {
        expect($$('.content').length).toBe(1);
        expect($$('.link').length).toBe(3);
    });

    it('should set notEmpty property depending on length', () => {
        expect($$('.content').notEmpty).toBeTruthy();
        expect($$('.nonExistentSelector').notEmpty).toBeFalsy();
    });

    it('should return the first element', () => {
        expect($$('.link').get(0).innerHTML).toBe('Link 1');
        expect($$('.link').$.innerHTML).toBe('Link 1');
    });

    it('should return element by index', () => {
        expect($$('.link').get(1).innerHTML).toBe('Link 2');
    });

    it('should return all elements', () => {
        expect($$('.link').getAll().length).toBe(3);
    });

    it('should find child element by selector', () => {
        expect($$('.content').find('.navigation')).not.toBeNull();
    });

    it('should add class to element', () => {
        const element = $$('.content').$;

        expect(element.className).toBe('content');

        $$(element).addClass('added-class');

        expect(element.className).toBe('content added-class');
    });

    it('should remove class from element', () => {
        const element = $$('.content').$;

        expect(element.className).toBe('content');

        $$(element).removeClass('content');

        expect(element.className).toBe('');
    });

    it('should check if element has class', () => {
        expect($$('.content').hasClass('content')).toBeTruthy();
        expect($$('.content').hasClass('non-existent-class')).toBeFalsy();
    });

    it('should remove element from dom', () => {
        expect($$('.content').notEmpty).toBeTruthy();
        
        $$('.content').remove();

        expect($$('.content').notEmpty).toBeFalsy();
    });

    /*
    it('should insert element after target', () => {
        const newElement = document.createElement('div');
        newElement.className = 'new-element';

        expect($$('.new-element').notEmpty).toBeFalsy();
        
        let elements = document.body.children;
        expect(elements[0].nodeName.toLowerCase()).toBe('header');
        expect(elements[1].nodeName.toLowerCase()).toBe('main');

        $$('.header').insertAfter(newElement);

        elements = document.body.children;
        expect(elements[0].nodeName.toLowerCase()).toBe('header');
        expect(elements[1].nodeName.toLowerCase()).toBe('div');
        expect(elements[2].nodeName.toLowerCase()).toBe('main');
    });*/
});
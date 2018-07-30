import $$ from "../src/qs-dom";
import { triggerEvent } from "./utils";

HTMLElement.prototype.insertAdjacentElement = function(position, element) {
    switch(position) {
        case 'beforebegin':
            return this.parentNode.insertBefore(element, this);

        case 'afterbegin':
            if (this.parentNode.children.length > 0) {

            } else {
                return this.appendChild(element);
            }
    }
};

const setHTML = () => {
    const s = document.createElement('style');
    s.innerHTML = '.header { margin: 5px 10px 8px 5px; }';
    document.head.appendChild(s);

    document.body.innerHTML = `
    <header class="header">
        <ul class="navigation">
            <li class="link">Link 1</li>
            <li class="link special-link">Link 2</li>
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

describe('QSDom construction', () => {
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
});

describe('QSDom array methods', () => {
    beforeEach(() => setHTML());

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

    it('should iterate over all elements', () => {
        let i = 0;

        $$('.link').forEach((element, index, total) => {
            expect(element).toBe($$('.navigation').$.children[i]);
            expect(index).toBe(i);
            expect(total).toBe(3);

            i++;
        });

        expect(i).toBe(3);
    });

    it('should map all elements', () => {
        let i = 0;

        const result = $$('.link').map((element, index, total) => {
            expect(element).toBe($$('.navigation').$.children[i]);
            expect(index).toBe(i);
            expect(total).toBe(3);

            i++;

            return element.textContent;
        });

        expect(i).toBe(3);
        expect(result).toEqual(['Link 1', 'Link 2', 'Link 3']);
    });

    it('should filter all elements', () => {
        let i = 0;

        const result = $$('.link').filter((element, index, total) => {
            expect(element).toBe($$('.navigation').$.children[i]);
            expect(index).toBe(i);
            expect(total).toBe(3);

            i++;

            return i === 2;
        });

        expect(i).toBe(3);
        expect(result.length).toBe(1);
        expect(result[0]).toBe($$('.navigation').$.children[1]);
    });
});

describe('QSDom DOM methods', () => {
    beforeEach(() => setHTML());

    it('should find child element by selector', () => {
        expect($$('.content').find('.navigation')).not.toBeNull();
    });

    it('should get index in parent', () => {
        expect($$('.special-link').getIndexInParent()).toBe(1);
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
    });

    it('should insert element before target', () => {
        const newElement = document.createElement('div');
        newElement.className = 'new-element';

        expect($$('.new-element').notEmpty).toBeFalsy();
        
        let elements = document.body.children;
        expect(elements[0].nodeName.toLowerCase()).toBe('header');
        expect(elements[1].nodeName.toLowerCase()).toBe('main');

        $$('.header').insertBefore(newElement);

        elements = document.body.children;
        expect(elements[0].nodeName.toLowerCase()).toBe('div');
        expect(elements[1].nodeName.toLowerCase()).toBe('header');
        expect(elements[2].nodeName.toLowerCase()).toBe('main');
    });

    it('should append element to selected element', () => {
        const newElement = document.createElement('div');
        newElement.className = 'new-element';

        expect($$('.new-element').notEmpty).toBeFalsy();
        
        let elements = $$('.header').$.children;
        expect(elements.length).toBe(1);
        expect(elements[0].nodeName.toLowerCase()).toBe('ul');

        $$('.header').append(newElement);

        elements = $$('.header').$.children;
        expect(elements.length).toBe(2);
        expect(elements[0].nodeName.toLowerCase()).toBe('ul');
        expect(elements[1].nodeName.toLowerCase()).toBe('div');
    });

    it('should prepend element to selected element', () => {
        const newElement = document.createElement('div');
        newElement.className = 'new-element';

        expect($$('.new-element').notEmpty).toBeFalsy();
        
        let elements = $$('.header').$.children;
        expect(elements.length).toBe(1);
        expect(elements[0].nodeName.toLowerCase()).toBe('ul');

        $$('.header').prepend(newElement);

        elements = $$('.header').$.children;
        expect(elements.length).toBe(2);
        expect(elements[0].nodeName.toLowerCase()).toBe('div');
        expect(elements[1].nodeName.toLowerCase()).toBe('ul');
    });

    it('should get element width', () => {
        const target = $$('.header').$;

        Object.defineProperty(target, 'clientWidth', {
            value: 900
        });
    
        expect($$(target).width).toBe(900);
    });

    it('should get element height', () => {
        const target = $$('.header').$;

        Object.defineProperty(target, 'clientHeight', {
            value: 600
        });
    
        expect($$(target).height).toBe(600);
    });

    it('should get element full width', () => {
        const target = $$('.header').$;

        Object.defineProperty(target, 'getBoundingClientRect', {
            value: () => ({
                width: 900,
                height: 600
            })
        });

        expect($$(target).fullWidth).toBe(915);
    });

    it('should get element full height', () => {
        const target = $$('.header').$;

        Object.defineProperty(target, 'getBoundingClientRect', {
            value: () => ({
                width: 900,
                height: 600
            })
        });

        expect($$(target).fullHeight).toBe(613);
    });

    it('should get absolute position', () => {
        const target = $$('.header .navigation').$;
        const parent = $$('.header').$;

        Object.defineProperty(target, 'offsetTop', { value: 1200 });
        Object.defineProperty(target, 'offsetLeft', { value: 40 });
        Object.defineProperty(target, 'offsetParent', { value: parent });

        Object.defineProperty(parent, 'offsetTop', { value: 20 });
        Object.defineProperty(parent, 'offsetLeft', { value: 10 });

        expect($$(target).absolutePosition).toEqual({ top: 1220, left: 50 });
    });
});

describe('QSDom Event methods', () => {
    beforeEach(() => setHTML());

    it('should listen on event', () => {
        let callbackCount = 0;
        const target = $$('.header').$;

        $$(target).on('click', () => {
            callbackCount++;
        });

        triggerEvent('click', target);

        expect(callbackCount).toBe(1);
    });

    it('should listen on multiple events', () => {
        let callbackCount = 0;
        const target = $$('.header').$;

        $$(target).on('click mouseenter mouseleave', () => {
            callbackCount++;
        });

        triggerEvent('click', target);
        triggerEvent('mouseenter', target);
        triggerEvent('mouseleave', target);

        expect(callbackCount).toBe(3);
    });

    it('should run callback if child by selector matches event', () => {
        let callbackCount = 0;
        const target = $$('.header').$;

        $$(document).onChildEventMatch('click', '.navigation', () => {
            callbackCount++;
        });

        triggerEvent('click', document);
       
        expect(callbackCount).toBe(0);

        triggerEvent('click', $$(target).find('.navigation'));

        expect(callbackCount).toBe(1);
    });

    it('should run callback if child as element matches event', () => {
        let callbackCount = 0;
        const target = $$('.header').$;

        $$(document).onChildEventMatch('click', $$(target).find('.navigation') as HTMLElement, () => {
            callbackCount++;
        });

        triggerEvent('click', document);
       
        expect(callbackCount).toBe(0);

        triggerEvent('click', $$(target).find('.navigation'));

        expect(callbackCount).toBe(1);
    });

    it('should dispatch event', () => {
        let callbackCount = 0;
        const target = $$('.header').$;

        target.addEventListener('click', () => callbackCount++);

        $$(target).dispatchEvent('click');

        expect(callbackCount).toBe(1);
    });

    it('should dispatch event with data', () => {
        const test = () => {
            let callbackCount = 0;
            let data = null;
            const target = $$('.header').$;
    
            target.addEventListener('click', event => {
                callbackCount++;
                data = event.detail;
            });
    
            $$(target).dispatchEvent('click', { test: true });
    
            expect(callbackCount).toBe(1);
            expect(data).toEqual({ test: true });
        };

        test();

        (global as any).CustomEvent = undefined;
        test();
    });

    it('should dispatch event if CustomEvent is undefined', () => {
        const test = () => {    
            let callbackCount = 0;
            const target = $$('.header').$;
    
            target.addEventListener('click', () => callbackCount++);
    
            $$(target).dispatchEvent('click');
    
            expect(callbackCount).toBe(1);
        };

        test();
        
        (global as any).CustomEvent = undefined;
        test();
    });
});

describe('QSDOM DocWin variants', () => {
    beforeEach(() => setHTML());

    it('should return index in parent as -1', () => {
        expect($$(document).getIndexInParent()).toBe(-1);
        expect($$(window).getIndexInParent()).toBe(-1);
    });

    it('should not return absolute position', () => {
        expect($$(document).absolutePosition).toEqual({ top: 0, left: 0 });
        expect($$(window).absolutePosition).toEqual({ top: 0, left: 0 });
    });

    it('should return viewport width', () => {
        Object.defineProperty(window, 'innerWidth', { value: 900 });

        expect($$(document).width).toBe(900);
        expect($$(window).width).toBe(900);
    });

    it('should return normal width for full width', () => {
        Object.defineProperty(window, 'innerWidth', { value: 900 });

        expect($$(document).fullWidth).toBe($$(document).width);
        expect($$(window).fullWidth).toBe($$(window).width);
    });

    it('should return viewport height', () => {
        Object.defineProperty(window, 'innerHeight', { value: 600 });

        expect($$(document).height).toBe(600);
        expect($$(window).height).toBe(600);
    });

    it('should return normal height for full height', () => {
        Object.defineProperty(window, 'innerHeight', { value: 600 });

        expect($$(document).fullHeight).toBe($$(document).height);
        expect($$(window).fullHeight).toBe($$(window).height);
    });
});
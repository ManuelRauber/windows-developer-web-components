const template = document.createElement('template');

template.innerHTML = `
  <style>
    .counter-container {
      --default-height: var(--height, 50px);
      
      width: calc(var(--default-height) * 3);
      height: var(--default-height);
      display: flex;
    }

    .counter-container > div {
      color: black;
      font-size: 2.2em;

      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .button {
      padding: 1rem;
      border: 1px solid black;
      user-select: none;
      cursor: pointer;
    }
    
    .value {
      margin: 0 1rem;
    }
  </style>

  <slot name="header">
    <h1>My Counter</h1>
  </slot>

  <div class="counter-container">
    <div class="button decrement">-</div>

    <div class="value" part="value">
      <slot name="value-prefix"></slot>
      <span class="value-display">0</span>
      <slot name="value-postfix"></slot>
    </div>

    <div class="button increment">+</div>
  </div>`;

class MyCounter extends HTMLElement {
  constructor() {
    super();

    this.shadow = this.attachShadow({ mode: 'open' });
    this.shadow.appendChild(template.content.cloneNode(true));

    this.decrementButton = this.shadow.querySelector('.decrement');
    this.incrementButton = this.shadow.querySelector('.increment');
    this.valueDisplay = this.shadow.querySelector('.value-display');

    this.decrementButton.addEventListener('click', () => this.decrement());
    this.incrementButton.addEventListener('click', () => this.increment());
  }

  connectedCallback() {
    this.render();
  }

  static get observedAttributes() {
    return [ 'value' ];
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (oldVal === newVal) {
      return;
    }

    if (name === 'value') {
      this.value = newVal;
    }
  }

  get value() {
    return +this.getAttribute('value') || 0;
  }

  set value(v) {
    this.setAttribute('value', Math.min(Math.max(+v, this.minValue), this.maxValue));
    this.render();
  }

  get minValue() {
    return +this.getAttribute('min-value') || -Infinity;
  }

  set minValue(v) {
    this.setAttribute('min-value', v);
  }

  get maxValue() {
    return +this.getAttribute('max-value') || Infinity;
  }

  set maxValue(v) {
    this.setAttribute('max-value', v);
  }

  increment() {
    this.value++;
    this.dispatchEvent(new CustomEvent('valueChange', { detail: this.value }));
  }

  decrement() {
    this.value--;
    this.dispatchEvent(new CustomEvent('valueChange', { detail: this.value }));
  }

  render() {
    this.valueDisplay.textContent = this.value;
  }
}

window.customElements.define('my-counter', MyCounter);

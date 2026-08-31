export class Spotlight {
  private container: HTMLElement;
  private cards: HTMLElement[];
  private mouse = { x: 0, y: 0 };
  private containerSize = { w: 0, h: 0 };

  constructor(containerElement: HTMLElement) {
    this.container = containerElement;
    this.cards = Array.from(this.container.children) as HTMLElement[];
    this.initContainer = this.initContainer.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.init();
  }

  private initContainer() {
    this.containerSize.w = this.container.offsetWidth;
    this.containerSize.h = this.container.offsetHeight;
  }

  private onMouseMove(event: MouseEvent) {
    const { clientX, clientY } = event;
    const rect = this.container.getBoundingClientRect();
    const { w, h } = this.containerSize;
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const inside = x < w && x > 0 && y < h && y > 0;
    
    if (inside) {
      this.mouse.x = x;
      this.mouse.y = y;
      this.cards.forEach((card) => {
        const cardRect = card.getBoundingClientRect();
        const cardX = -(cardRect.left - rect.left) + this.mouse.x;
        const cardY = -(cardRect.top - rect.top) + this.mouse.y;
        card.style.setProperty('--mouse-x', `${cardX}px`);
        card.style.setProperty('--mouse-y', `${cardY}px`);
      });
    }
  }

  private init() {
    this.initContainer();
    window.addEventListener('resize', this.initContainer);
    window.addEventListener('mousemove', this.onMouseMove);
  }

  public destroy() {
    window.removeEventListener('resize', this.initContainer);
    window.removeEventListener('mousemove', this.onMouseMove);
  }
}

// Initialize spotlight effects
export function initSpotlights() {
  const spotlights = document.querySelectorAll('[data-spotlight]');
  const instances: Spotlight[] = [];
  
  spotlights.forEach((spotlight) => {
    instances.push(new Spotlight(spotlight as HTMLElement));
  });
  
  return instances;
}
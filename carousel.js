const SLIDES_PER_VIEW = 3

class Carousel {
    constructor(id) {
        this.currentPage = 1;

        this.rootEl = document.querySelector(`[data-carousel="${id}"]`);
        this.innerEl = this.rootEl.getElementsByClassName('carousel__inner')[0];
        this.slideEls = this.rootEl.getElementsByClassName('carousel__slide');

        this.prevBtnEl = document.querySelector(`[data-carousel-prev="${id}"]`);
        this.nextBtnEl = document.querySelector(`[data-carousel-next="${id}"]`);
        this.currentPageEl = document.querySelector(`[data-carousel-current-page="${id}"]`);
        this.pagesCountEl = document.querySelector(`[data-carousel-pages-count="${id}"]`);

        this.updateDetails();
        this.updateSlidesWidth();
        this.registerEventListeners();
    }

    get slideWidth() {
        return this.rootEl.clientWidth / SLIDES_PER_VIEW;
    }

    get pagesCount() {
        return Math.ceil(this.slideEls.length / SLIDES_PER_VIEW);
    }

    get isFirstPage() {
        return this.currentPage === 1;
    }

    get isLastPage() {
        return this.currentPage === this.pagesCount;
    }

    updateSlidesWidth() {
        for (const slide of this.slideEls) {
            slide.style.width = `${this.slideWidth}px`;
        }
    }

    next() {
        if (this.isLastPage) return;

        this.to(++this.currentPage);
    }

    prev() {
        if (this.isFirstPage) return;

        this.to(--this.currentPage);
    }

    to(page) {
        this.innerEl.style.transform = `translateX(${-this.innerEl.clientWidth * (page - 1)}px)`;

        this.updateDetails();
    }

    updateDetails() {
        this.currentPageEl.textContent = this.currentPage;
        this.pagesCountEl.textContent = this.pagesCount.toString();

        this.prevBtnEl.toggleAttribute('disabled', this.isFirstPage);
        this.nextBtnEl.toggleAttribute('disabled', this.isLastPage);
    }

    registerEventListeners() {
        this.prevBtnEl.addEventListener('click', this.prev.bind(this));
        this.nextBtnEl.addEventListener('click', this.next.bind(this));
    }
}
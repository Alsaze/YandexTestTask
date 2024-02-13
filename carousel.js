const DEFAULT_CAROUSEL_OPTIONS = {
    desktop: {
        slidesPerView: 3,
    },
    mobile: {
        slidesPerView: 1,
    },
}

NodeList.prototype.toggleAttribute = function (name, force) {
    for (const el of this.values()) {
        el.toggleAttribute(name, force);
    }
}

NodeList.prototype.addEventListener = function (name, cb) {
    for (const el of this.values()) {
        el.addEventListener(name, cb);
    }
}

NodeList.prototype.setTextContent = function (content) {
    for (const el of this.values()) {
        el.textContent = content;
    }
}

class Carousel {
    constructor(id, options) {
        this.currentPage = 1;

        this.options = {...DEFAULT_CAROUSEL_OPTIONS, ...options};

        this.rootEl = document.querySelector(`[data-carousel="${id}"]`);
        this.innerEl = this.rootEl.getElementsByClassName('carousel__inner')[0];
        this.slideEls = this.rootEl.getElementsByClassName('carousel__slide');

        this.prevBtnEls = document.querySelectorAll(`[data-carousel-prev="${id}"]`);
        this.nextBtnEls = document.querySelectorAll(`[data-carousel-next="${id}"]`);
        this.currentPageEls = document.querySelectorAll(`[data-carousel-current-page="${id}"]`);
        this.pagesCountEls = document.querySelectorAll(`[data-carousel-pages-count="${id}"]`);

        this.paginationEls = document.querySelectorAll(`[data-carousel-pagination="${id}"]`);
        this.mediaQueryList = window.matchMedia("(max-width: 480px)");

        this.renderPagination();
        this.update();
        this.updateSlidesWidth();
        this.registerEventListeners();
    }

    get isMobile() {
        return this.mediaQueryList.matches;
    }

    get slidesPerView() {
        return this.isMobile ? this.options.mobile.slidesPerView : this.options.desktop.slidesPerView;
    }

    get pagesCount() {
        return Math.ceil(this.slideEls.length / this.slidesPerView);
    }

    get isFirstPage() {
        return this.currentPage === 1;
    }

    get isLastPage() {
        return this.currentPage === this.pagesCount;
    }

    next() {
        if (this.isLastPage) return;

        this.to(this.currentPage + 1);
    }

    prev() {
        if (this.isFirstPage) return;

        this.to(this.currentPage - 1);
    }

    to(page) {
        this.currentPage = page;

        this.innerEl.style.transform = `translateX(${-100 * (page - 1)}%)`;

        this.update();
    }

    update() {
        this.currentPageEls.setTextContent(this.currentPage);
        this.pagesCountEls.setTextContent(this.pagesCount.toString());
        this.prevBtnEls.toggleAttribute('disabled', this.isFirstPage);
        this.nextBtnEls.toggleAttribute('disabled', this.isLastPage);

        for (const el of this.paginationEls) {
            for (let bulletIdx = 0; bulletIdx < el.children.length; bulletIdx++) {
                el.children.item(bulletIdx).classList.toggle('carousel__bullet--active', this.currentPage === bulletIdx + 1);
            }
        }
    }

    registerEventListeners() {
        this.mediaQueryList.addEventListener('change', () => {
            this.updateSlidesWidth();

            this.to(1);
        });

        this.prevBtnEls.addEventListener('click', this.prev.bind(this));
        this.nextBtnEls.addEventListener('click', this.next.bind(this));
    }

    updateSlidesWidth() {
        const targetWidth = `${100 / this.slidesPerView}%`;

        for (const slide of this.slideEls) {
            slide.style.width = targetWidth;
        }
    }

    renderPagination() {
        if (!this.paginationEls.length) return;

        for (const el of this.paginationEls) {
            el.innerHTML = '';

            for (let page = 1; page <= this.pagesCount; page++) {
                const bullet = document.createElement('div');
                bullet.classList.add('carousel__bullet');
                bullet.classList.toggle('carousel__bullet--active', page === 1);

                el.appendChild(bullet);
            }
        }
    }
}
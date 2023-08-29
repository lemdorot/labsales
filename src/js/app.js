
window['FLS'] = true;

import "../scss/style.scss";
// ========================================================================================================================================================================================================================================================
// ========================================================================================================================================================================================================================================================
// ========================================================================================================================================================================================================================================================
import * as flsFunctions from "./files/functions.js";

flsFunctions.isWebp();

flsFunctions.menuInit();

flsFunctions.tabs();
//============================================================================================================================================================================================================================================

const menu_links = document.querySelectorAll('.menu__link');
if (window.matchMedia("(max-width: 992px)").matches) {
    menu_links.forEach((elem) => {
        elem.addEventListener('click', (e) => {
            e.preventDefault();
            console.log(elem.classList);
    
            if (elem.nextSibling) { 
                while (elem.parentNode.children) {
                    if (elem.nextElementSibling.classList.contains('menu__list')) {
                        if (elem.classList.contains('active')) {
                            elem.classList.remove('active');
                            elem.nextElementSibling.style.maxHeight = elem.nextElementSibling.scrollHeight + 'px';
                            elem.nextElementSibling.style.paddingTop = 0;
                            setTimeout(() => {
                                elem.nextElementSibling.style.maxHeight = 0;
                            }, 5)
                            
                            setTimeout(() => {
                                elem.nextElementSibling.style.display = 'none';
                            }, 600)
                            break;
                        } else {
                            elem.classList.add('active');
                            elem.nextElementSibling.style.display = 'flex';
                            setTimeout(() => {
                                elem.nextElementSibling.style.maxHeight = elem.nextElementSibling.scrollHeight + 30 + 'px';
                                elem.nextElementSibling.style.paddingTop = '15px';
                            }, 5)
                            setTimeout(() => {
                                elem.nextElementSibling.style.maxHeight = 'none';
                            }, 400)
                            break;
                        }
                        
                        
                    }
                }
            }
        })
    })
}
//============================================================================================================================================================================================================================================

function initSliders() {
	
	if (document.querySelector('.advantages__slider')) {
		
		new Swiper('.advantages__slider', {
			slidesPerView: 1.2,
			spaceBetween: 36,
			pagination: {
			clickable: true,
			},
			autoplay: {
				delay: 3000,
				disableOnInteraction: false,
			},
			watchOverflow: true,
			breakpoints: {
				640: {
					slidesPerView: 2,
					spaceBetween: 36,
					autoHeight: true,
				},
				768: {
					slidesPerView: 3,
					spaceBetween: 36,
				},
				1200: {
					slidesPerView: 4,
					spaceBetween: 36,
				},
			},

			simulateTouch: true,
			touchRatio: 1,
			touchAngle: 45,
			grabCursor: true,
			slideToClickedSlide: true,
			});
	}
		new Swiper(".complex__slider", {
			slidesPerView: 1,
			autoHeight: false,
			grid: {
			rows: 2,
			},
			spaceBetween: 36,
			pagination: {
			el: ".swiper-pagination",
			clickable: true,
			},
			watchOverflow: true,
			breakpoints: {
				640: {
					slidesPerView: 2,
					spaceBetween: 36,
					grid: {
						rows: 2,
						},
				},
				768: {
					slidesPerView: 3,
					spaceBetween: 36,
					grid: {
			rows: 2,
			},
				},
				1200: {
					slidesPerView: 4,
					spaceBetween: 31,
					grid: {
						rows: 2,
						},
				},
			},
			autoplay: {
				delay: 3000,
				disableOnInteraction: false,
			},
			simulateTouch: true,
			touchRatio: 1,
			touchAngle: 45,
			grabCursor: true,
			slideToClickedSlide: true,
		  });
}

window.addEventListener("load", function (e) {
	initSliders();
});
//============================================================================================================================================================================================================================================


import {LOCATION, LOCATION_1, LOCATION_2, LOCATION_3, LEFT_MARKER, RIGHT_MARKER, TOP_MARKER,TOP_DEFAULT_MARKER,RIGHT_DEFAULT_MARKER,LEFT_DEFAULT_MARKER,TOP_DEFAULT_MARKER_POPUP, groups} from "./common.js";

window.map = null;

        main();
        async function main() {
            await ymaps3.ready;
            const {
                YMap,
                YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer,
                YMapFeatureDataSource, YMapLayer,
                YMapControls,
                YMapMarker
            } = ymaps3;

            map = new YMap(document.getElementById('app'), {location: LOCATION});

            map.addChild(new YMapDefaultSchemeLayer());
            map.addChild(new YMapDefaultFeaturesLayer());

            map.addChild(new YMapFeatureDataSource({id: 'popups'}));
            map.addChild(new YMapLayer({source: 'popups'}));

            class MyMarkerWithPopup extends ymaps3.YMapComplexEntity {
                _onAttach() { this._actualize(); }
                _onDetach() { this.marker = null; }
                _onUpdate(props) {
                    if (props.coordinates) {
                        this.marker?.update({coordinates: props.coordinates});
                    }
                    this._actualize();
                }

                _actualize() {
                    const props = this._props;
                    this._lazyCreatePopup();
                    this._lazyCreateMarker();

                    if (!this._state.popupOpen || !props.popupHidesMarker) {
                        this.addChild(this.marker);
                    } else if (this.marker) {
                        this.removeChild(this.marker);
                    }

                    if (this._state.popupOpen) {
                        this.popupElement.style.display = 'flex';
                    } else if (this.popupElement) {
                        this.popupElement.style.display = 'none';
                    }
                }
                _lazyCreateMarker() {
                    if (this.marker) return;

                    const pinElement = document.createElement('div');
                    pinElement.className = 'my-marker__pin';

					const el = document.createElement('img');
					el.className = 'my-marker__img';
					el.src = './img/map/pin-1.svg';

                    const markerElement = document.createElement('div');
                    markerElement.className = 'my-marker'
                    markerElement.append(el);
                    markerElement.append(pinElement);

                    this._markerElement = markerElement;

                    pinElement.onclick = () => {
                        this._state.popupOpen = true;
                        this._actualize();
                    };

                    const container = document.createElement('div');
                    container.append(this._markerElement, this.popupElement);

                    this.marker = new YMapMarker({coordinates: this._props.coordinates}, container);
                }

                _lazyCreatePopup() {
                    if (this.popupElement) return;

                    const element = document.createElement('div');
                    element.className = 'popup';

                    const textElement = document.createElement('div');
                    textElement.className = 'popup__text';
                    textElement.textContent = this._props.popupContent;

                    element.append(textElement);

                    this.popupElement = element;
                }

                constructor(props) {
                    super(props);
                    this._state = {popupOpen: false};
                }
            }

            map.addChild(new MyMarkerWithPopup({
                coordinates: LOCATION_1.center,
                popupContent: 'ЖК "Яблоновский"',
            }));
            map.addChild(new MyMarkerWithPopup({
                coordinates: LOCATION_2.center,
                popupContent: 'Магазины',
            }));
            map.addChild(new MyMarkerWithPopup({
                coordinates: LOCATION_3.center,
                popupContent: 'Детский сад',
            }));

			const pins = document.querySelectorAll('.my-marker__img');
			const markers = document.querySelectorAll('.my-marker');

			pins.forEach((item, index) => {
				item.src = `./img/map/pin-${index + 1}.svg`;
			})

			const tabs_container = document.querySelector('.map__tabs-container');

			markers.forEach((item, index) => {
				item.id = `marker-${index + 1}`;
				const tabElement = document.createElement('div');
				tabElement.className = 'card tab-map';
	
				const tabWrapper = document.createElement('div');
				tabWrapper.className = 'card__wrap tab-map__wrap';
				tabElement.append(tabWrapper);
	
				const span = document.createElement('span');
				const img = document.createElement('img');
				img.src = item.firstChild.src;
				span.append(img);
	
				const tabText = document.createElement('p');
				tabText.className = 'card__text tab-map__text';
				tabText.textContent = item.nextElementSibling.firstChild.textContent;
				tabWrapper.append(span, tabText);

				item.onclick = () => {
					if (tabElement.classList.contains('active')) {
						item.nextElementSibling.style.display = 'none';
						tabElement.classList.remove('active');
					}else {
						item.nextElementSibling.style.display = 'flex';
						tabElement.classList.add('active');
					}
				};
				
				tabElement.onclick = () => {
					if (tabElement.classList.contains('active')) {
						item.nextElementSibling.style.display = 'none';
						tabElement.classList.remove('active');
					}else {
						item.nextElementSibling.style.display = 'flex';
						tabElement.classList.add('active');
					}
				};

				tabs_container.append(tabElement);
			})

			
        }

const mapContainer = document.querySelector('#app');

window.addEventListener('resize', (e) => {
    if (window.matchMedia("(min-width: 992px)").matches) {
        mapContainer.style.height = '662' + 'px';
    }else {
        mapContainer.style.height = '622' + 'px';
    }
});

//============================================================================================================================================================================================================================================

const tabsButtons = document.querySelectorAll('.tabs__btn');
const photosContainer = document.querySelector('.tabs__photos');
const tabsPhotos = document.querySelectorAll('.tabs__body');

tabsButtons.forEach((item) => {
	item.onclick = () => {
		photosContainer.innerHTML = '';
		tabsPhotos.forEach((item) => {
			if (item.hasAttribute('hidden')) {
				const image = item.firstElementChild.firstElementChild.cloneNode(true);
				photosContainer.append(image);
			}
		});
	}
});
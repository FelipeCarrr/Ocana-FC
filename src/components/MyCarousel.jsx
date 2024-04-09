import React, { useEffect } from 'react';
import Carousel from 'react-multi-carousel';
import '../../../../../node_modules/react-multi-carousel/lib/styles.css';



export default function Links() {

      

    const CustomRightArrow = ({ onClick, ...rest }) => {
        const {
          onMove,
          carouselState: { currentSlide, deviceType }
        } = rest;
        return (
            <div className="button_arrow-right  noselect" onClick={() => onClick()}>
                 <span className="material-icons">arrow_forward_ios</span>
            </div>
        );
    };

      const CustomLeftArrow = ({ onClick, ...rest }) => {
        const {
          onMove,
          carouselState: { currentSlide, deviceType }
        } = rest;
        return (
            <div className="button_arrow  noselect" onClick={() => onClick()}>
                <span className="material-icons">arrow_back_ios</span>
            </div>
        );
      };



    return (
        <section className="slide" data-s="links">
            <div id="grid_link">
                <Carousel
                    additionalTransfrom={0}
                    arrows
                    autoPlay={true}
                    autoPlaySpeed={2500}
                    centerMode={false}
                    customRightArrow={<CustomRightArrow/>}
                    customLeftArrow={<CustomLeftArrow/>}
                    className=""
                    containerClass="carrousel"
                    dotListClass=""
                    draggable
                    focusOnSelect={false}
                    infinite
                    itemClass=""
                    keyBoardControl
                    minimumTouchDrag={80}
                    pauseOnHover
                    renderArrowsWhenDisabled={false}
                    renderButtonGroupOutside={false}
                    renderDotsOutside={false}
                    responsive={{
                        desktop: {
                        breakpoint: {
                            max: 3000,
                            min: 1024
                        },
                        items: 4,
                        partialVisibilityGutter: 40
                        },
                        mobile: {
                        breakpoint: {
                            max: 464,
                            min: 0
                        },
                        items: 1,
                        partialVisibilityGutter: 30
                        },
                        tablet: {
                        breakpoint: {
                            max: 1024,
                            min: 464
                        },
                        items: 2,
                        partialVisibilityGutter: 30
                        }
                        }}
                        rewind={false}
                        rewindWithAnimation={false}
                        rtl={false}
                        shouldResetAutoplay
                        showDots={false}
                        sliderClass=""
                        slidesToSlide={1}
                        swipeable
                    >
                    <div className="self_link">
                        <span className="material-icons">class</span>
                        <div className="link_text">Concurso Docente</div>
                    </div>
                    <div className="self_link">
                        <span className="material-icons">quiz</span>
                        <div className="link_text">Primeros Previos</div>
                    </div>
                    <div className="self_link">
                        <span className="material-icons">collections</span>
                        <div className="link_text">Fotografias</div>
                    </div>
                    <div className="self_link">
                        <span className="material-icons">account_balance</span>
                        <div className="link_text">Rendición de cuentas</div>
                    </div>
                    <div className="self_link">
                        <span className="material-icons">find_in_page</span>
                        <div className="link_text">Transparencia y Acceso a la Información Pública</div>
                    </div>
                    <div className="self_link">
                        <span className="material-icons">save</span>
                        <div className="link_text">Banco de Datos</div>
                    </div>
                </Carousel>
            </div>
        </section>
    );
}

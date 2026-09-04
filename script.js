document.addEventListener('DOMContentLoaded', () => {

    /* 1. ハンバーガーメニュー */
    const hamburger = document.getElementById('hamburger');
    const nav = document.getElementById('nav');
    const body = document.body;

    if (hamburger && nav) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('is-active');
            nav.classList.toggle('is-active');
            body.classList.toggle('is-fixed');
        });
        const navLinks = nav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('is-active');
                nav.classList.remove('is-active');
                body.classList.remove('is-fixed');
            });
        });
    }

    /* 2. ヘッダースクロール */
    const header = document.getElementById('header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) header.classList.add('is-scrolled');
            else header.classList.remove('is-scrolled');
        });
    }

    /* 3. トップページ専用：ネットワークの線 自動描画 */
    function drawDynamicLines() {
        const voiceContainer = document.querySelector('.network-container');
        const voiceCenter = document.querySelector('.network-center .circle');
        const voiceCards = document.querySelectorAll('.network-card');
        const voiceSvg = document.querySelector('.network-lines');

        if (voiceContainer && voiceCenter && voiceCards.length > 0 && voiceSvg) {
            voiceSvg.innerHTML = ''; 
            const cRect = voiceContainer.getBoundingClientRect();
            const centerRect = voiceCenter.getBoundingClientRect();
            const startX = centerRect.left - cRect.left + (centerRect.width / 2);
            const startY = centerRect.top - cRect.top + (centerRect.height / 2);

            voiceCards.forEach(card => {
                const icon = card.querySelector('.face-icon');
                if (icon) {
                    const iconRect = icon.getBoundingClientRect();
                    const endX = iconRect.left - cRect.left + (iconRect.width / 2);
                    const endY = iconRect.top - cRect.top + (iconRect.height / 2);
                    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                    line.setAttribute('x1', startX);
                    line.setAttribute('y1', startY);
                    line.setAttribute('x2', endX);
                    line.setAttribute('y2', endY);
                    line.setAttribute('stroke', '#8AB4D4');
                    line.setAttribute('stroke-width', '1.5');
                    voiceSvg.appendChild(line);
                }
            });
        }
        
        const infoContainer = document.querySelector('.infographic-container');
        const infoCenter = document.querySelector('.info-center');
        const infoBoxes = document.querySelectorAll('.js-dynamic-line-source');
        const infoSvg = document.querySelector('.connecting-lines');
        
        if (infoContainer && infoCenter && infoBoxes.length > 0 && infoSvg) {
            infoSvg.innerHTML = ''; 
            const cRect = infoContainer.getBoundingClientRect();
            const centerRect = infoCenter.getBoundingClientRect();
            const startX = centerRect.left - cRect.left + (centerRect.width / 2);
            const startY = centerRect.top - cRect.top + (centerRect.height / 2);

            infoBoxes.forEach(box => {
                const boxRect = box.getBoundingClientRect();
                const endX = boxRect.left - cRect.left + (boxRect.width / 2);
                const endY = boxRect.top - cRect.top + (boxRect.height / 2);
                const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                line.setAttribute('x1', startX);
                line.setAttribute('y1', startY);
                line.setAttribute('x2', endX);
                line.setAttribute('y2', endY);
                line.setAttribute('stroke', '#8AB4D4');
                line.setAttribute('stroke-width', '2');
                line.setAttribute('stroke-dasharray', '5,5');
                infoSvg.appendChild(line);
            });
        }
    }
    
    if(document.querySelector('.network-container') || document.querySelector('.infographic-container')) {
        window.addEventListener('load', drawDynamicLines);
        window.addEventListener('resize', drawDynamicLines);
    }

    /* 4. フェードインアニメーション（※中央の円 .network-center は除外して確実に表示） */
    const fadeElements = document.querySelectorAll('.js-fade-up');
    const extraElements = document.querySelectorAll('.info-box, .network-card, .center-graphic');
    
    extraElements.forEach(el => {
        if (!el.classList.contains('js-fade-up')) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(40px)';
            el.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
        }
    });

    const observerOptions = { root: null, rootMargin: '0px', threshold: 0.1 };

    const observer = new IntersectionObserver((entries, observer) => {
        let needsAnimation = false;

        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-active');
                observer.unobserve(entry.target);
                if(entry.target.classList.contains('network-card') || entry.target.classList.contains('info-box') || entry.target.classList.contains('center-graphic')) {
                     needsAnimation = true;
                }
            }
        });

        if (needsAnimation) {
            let startTime = Date.now();
            function animateLines() {
                drawDynamicLines();
                if (Date.now() - startTime < 850) {
                    requestAnimationFrame(animateLines);
                }
            }
            requestAnimationFrame(animateLines);
        }
    }, observerOptions);

    fadeElements.forEach(element => observer.observe(element));


    /* 5. 施工事例専用：カテゴリ絞り込み（フィルター）機能 */
    const filterBtns = document.querySelectorAll('.filter-btn');
    const workItems = document.querySelectorAll('.work-item');

    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filterValue = btn.getAttribute('data-filter');

                workItems.forEach(item => {
                    if (filterValue === 'all') {
                        item.classList.remove('hide');
                    } else {
                        if (item.classList.contains(filterValue)) {
                            item.classList.remove('hide');
                        } else {
                            item.classList.add('hide');
                        }
                    }
                });
            });
        });
    }

    /* 6. 施工事例：モーダル詳細ポップアップ機能 */
    const modal = document.getElementById('workModal');
    const modalClose = document.getElementById('modalClose');
    const modalImg = document.getElementById('modalImg');
    const modalTitle = document.getElementById('modalTitle');
    const modalClient = document.getElementById('modalClient');
    const modalDesc = document.getElementById('modalDesc');

    if (modal && workItems.length > 0) {
        workItems.forEach(item => {
            item.addEventListener('click', () => {
                const title = item.getAttribute('data-title');
                const client = item.getAttribute('data-client');
                const desc = item.getAttribute('data-desc');
                const imgSrc = item.getAttribute('data-img');

                modalTitle.textContent = title;
                modalClient.textContent = client;
                modalDesc.textContent = desc;
                modalImg.src = imgSrc;

                modal.classList.add('is-active');
                body.classList.add('is-fixed');
            });
        });

        const closeModal = () => {
            modal.classList.remove('is-active');
            body.classList.remove('is-fixed');
        };

        if (modalClose) modalClose.addEventListener('click', closeModal);

        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }

});

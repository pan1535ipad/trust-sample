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

                const sourceHeading = item.querySelector('.work-info h3');
                modalTitle.classList.toggle('phrase-heading', !!sourceHeading);
                if (sourceHeading) {
                    modalTitle.replaceChildren(...Array.from(sourceHeading.childNodes, node => node.cloneNode(true)));
                } else {
                    modalTitle.textContent = title;
                }
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
/* Keep industry terms intact on narrow screens without fixing whole sentences. */
(() => {
  const terms = [
    "高圧受変電設備", "自動火災報知設備", "非常用発電設備", "給排水衛生設備工事",
    "業務用空調設備工事", "換気・排煙設備工事", "ウレタン塗膜防水", "フレキシブルダクト",
    "パッケージエアコン", "給排水衛生設備", "受変電・幹線設備", "非常用電源・防災設備",
    "ダクト製作・取付", "空調・換気設備工事", "空調・換気ダクト", "冷媒・ドレン配管工事",
    "アスファルト防水", "ベランダ・廊下防水", "漏水調査・部分補修", "古民家再生",
    "給水ポンプ設備", "給水ポンプ更新", "給水設備工事", "排水設備", "通気設備",
    "衛生設備工事", "衛生器具", "給湯設備", "給水方式", "受水槽", "排水ポンプ",
    "受変電設備", "幹線・分電盤設備", "LED照明設備", "照明・動力設備", "弱電・通信設備",
    "防犯カメラ設備", "コンセント設備", "電気設備工事", "電気設備", "分電盤",
    "シート防水", "屋上防水", "防水工事", "防水工法", "防水性能", "防水層",
    "劣化状況調査", "散水調査", "現地調査", "施工計画", "改修工事",
    "給排気設備", "排煙ダクト工事", "厨房排気・フード工事", "保温・防露工事",
    "ドレン配管", "冷媒配管", "空調設備", "換気設備", "既存設備", "設備改修",
    "注文住宅", "外壁塗装", "耐震基準", "修繕計画", "定期点検"
  ].sort((a, b) => b.length - a.length);
  const escape = term => term.replace(/[.*+?^$()|[\]\\{}]/g, "\\$&");
  const pattern = new RegExp(terms.map(escape).join("|"), "g");
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement;
      pattern.lastIndex = 0;
      return parent && !parent.closest("script,style,textarea,.term-keep,.phrase-heading") && pattern.test(node.data)
        ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
    }
  });
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach(node => {
    pattern.lastIndex = 0;
    const fragment = document.createDocumentFragment();
    let last = 0;
    for (const match of node.data.matchAll(pattern)) {
      fragment.append(node.data.slice(last, match.index));
      const span = document.createElement("span");
      span.className = "term-keep";
      span.textContent = match[0];
      fragment.append(span);
      last = match.index + match[0].length;
    }
    fragment.append(node.data.slice(last));
    node.replaceWith(fragment);
  });
})();

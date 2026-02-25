(function() {
    const cards = document.querySelectorAll('.project-card[data-github]');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(async (entry) => {
            if (!entry.isIntersecting) return;

            const card = entry.target;
            observer.unobserve(card); // Only load once

            const repo      = card.dataset.github;
            const container = card.querySelector('.readme-container');
            const githubLink = card.querySelector('.project-github-link');

            if (githubLink) githubLink.href = `https://github.com/${repo}`;

            container.innerHTML = '<span>Loading README...</span>';

            try {
                const res = await fetch(
                    `https://api.github.com/repos/${repo}/readme`,
                    { headers: { Accept: 'application/vnd.github.html+json' } }
                );
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                container.innerHTML = await res.text();

                const baseUrl = `https://raw.githubusercontent.com/${repo}/HEAD/`;
                container.querySelectorAll('img').forEach(img => {
                    const src = img.getAttribute('src');
                    if (src && !src.startsWith('http')) img.src = baseUrl + src;
                });

            } catch (err) {
                container.innerHTML = `<span>Could not load README for ${repo}</span>`;
            }
        });
    }, { rootMargin: '200px' }); // Start loading 200px before box is visible

    cards.forEach(card => observer.observe(card));
})();
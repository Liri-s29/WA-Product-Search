const { algoliasearch, instantsearch } = window;

const searchClient = algoliasearch(
  'RG9CP54HCJ',
  '3dd62c51496c206919d27e1663855acd'
);

const search = instantsearch({
  indexName: 'products',
  searchClient,
  future: { preserveSharedStateOnUnmount: true },
});

search.addWidgets([
  instantsearch.widgets.searchBox({
    container: '#searchbox',
  }),

  instantsearch.widgets.rangeSlider({
    container: '#filter-price',
    attribute: 'price',
    step: 1000, // adjust this as needed (e.g. 1000, 5000)
    tooltips: {
      format: (value) => `₹${Math.round(value).toLocaleString()}`,
    },
    pips: false, // disables tick marks for minimalism
  }),
  
  instantsearch.widgets.refinementList({
    container: '#filter-photo-count',
    attribute: 'photo_count',
    searchable: false,
    templates: {
      header: '', // no visible header for minimalist look
    },
  }),

  instantsearch.widgets.hits({
    container: '#hits',
    templates: {
      item: (hit, { html, components }) => html`
        <article style="font-family: sans-serif; width: 100%;">
          <div style="display: flex; flex-direction: column; gap: 8px;">
            <h1 style="font-size: 1.25rem; font-weight: 600; color: #222;">
              ${components.Highlight({ hit, attribute: 'title' })}
            </h1>
            <p style="margin: 0; font-size: 1rem; font-weight: 500; color: green;">
              ₹${hit.price.toLocaleString()}
            </p>
            <p style="margin: 0; font-size: 0.9rem; color: #444;">
              ${components.Highlight({ hit, attribute: 'description' })}
            </p>
            <p style="margin: 0; font-size: 0.9rem; color: #555;">
              Photos available: ${hit.photo_count}
            </p>
            <p style="margin: 0; font-size: 0.9rem; color: #555;">
              Seller: ${components.Highlight({ hit, attribute: 'seller_name' })} (${hit.seller_city})
            </p>
            <p style="margin: 0; font-size: 0.85rem; color: #888;">
              Contact: <a href="https://wa.me/${hit.seller_contact}" target="_blank" rel="noopener noreferrer">
                ${hit.seller_contact}
              </a>
            </p>
            <a href="${hit.product_link}" target="_blank" rel="noopener noreferrer"
              style="font-size: 0.85rem; color: #1a73e8; text-decoration: underline; word-break: break-word;">
              View Product on WhatsApp
            </a>
            <a href="${hit.catalogue_url}" target="_blank" rel="noopener noreferrer"
              style="font-size: 0.8rem; color: #999;">
              View Seller Catalogue
            </a>
          </div>
        </article>
      `,
    },
  }),
  instantsearch.widgets.configure({
    hitsPerPage: 8,
  }),
  instantsearch.widgets.pagination({
    container: '#pagination',
  }),
]);

search.start();

search.on('render', () => {
  const tooltips = document.querySelectorAll('.ais-RangeSlider .rheostat-tooltip');
  if (tooltips.length === 2) {
    tooltips[0].style.top = '-24px'; // left handle
    tooltips[1].style.top = '30px'; // right handle (default)
  }
});

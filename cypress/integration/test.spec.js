import urlTools from 'url-toolkit';

const BASE_QUERY = 'experimentId=Default';
const options = {
  headers: {
    'x-debug': true,
  },
};

const product = {
  modules    : 'div[data-element~=product-results-result-set-desktop] article[data-element~=product-results-product-module-desktop]',
  media      : 'div[data-element~=product-module-media]',
  mediaImage : 'img[data-element~=product-module-media-image]',
  mediaLink  : 'a[data-element~=product-module-media-link]',
  title      : 'h3[data-element~=product-module-title]',
  price      : 'div[data-element~=product-module-price]',
};

describe('product-module', function() {

  describe('Any product', function() {

    before(function() {
      cy.visit(`/c/womens-dresses-shop?${BASE_QUERY}`, options);
    });

    beforeEach(function() {
      cy.get(product.modules).first().as('product');
    });

    it('Has a product title', function() {
      cy.get('@product').find(product.title).should('exist');
    });

    it('Has a price', function() {
      cy.get('@product').find(product.price).should('exist');
    });

    describe('Image', function() {

      beforeEach(function() {
        cy.get('@product')
            .find(product.media)
            .as('media')
            .children(product.mediaImage)
            .as('mediaImage');
      });

      it('Exists', function() {
        cy.get('@mediaImage').should('exist');
      });

    });

    describe('Navigates to product page', function() {

      afterEach(function() {
        cy.visit(`/c/womens-dresses-shop?${BASE_QUERY}`, options);
      });

      it('When image is clicked', function() {

        cy.url().then( originalUrl => {

          cy.get('@product')
              .children(product.media)
              .children(product.mediaLink)
              .as('productPageLink')
              .invoke('attr', 'href')
              .then( productPageUrl => urlTools.buildAbsoluteURL(originalUrl, productPageUrl) )
              .then( productPageUrl => {
                cy.get('@productPageLink')
                    .click()
                    .then( () => {
                      cy.url().should('equal', productPageUrl);
                    });
              });

        });

      });

      it('When product name is clicked', function() {

        cy.url().then( originalUrl => {

          cy.get('@product')
              .children(product.title)
              .children('a')
              .as('productPageLink')
              .invoke('attr', 'href')
              .then( productPageUrl => urlTools.buildAbsoluteURL(originalUrl, productPageUrl) )
              .then( productPageUrl => {
                cy.get('@productPageLink')
                    .click()
                    .then( () => {
                      cy.url().should('equal', productPageUrl);
                    });
              });

        });

      });

    });

  });

});

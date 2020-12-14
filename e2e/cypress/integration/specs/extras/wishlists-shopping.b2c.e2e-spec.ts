import { at } from '../../framework';
import { createUserViaREST } from '../../framework/users';
import { LoginPage } from '../../pages/account/login.page';
import { sensibleDefaults } from '../../pages/account/registration.page';
import { WishlistsDetailsPage } from '../../pages/account/wishlists-details.page';
import { WishlistsOverviewPage } from '../../pages/account/wishlists-overview.page';
import { CartPage } from '../../pages/checkout/cart.page';
import { CategoryPage } from '../../pages/shopping/category.page';
import { FamilyPage } from '../../pages/shopping/family.page';

const _ = {
  user: {
    login: `test${new Date().getTime()}@testcity.de`,
    ...sensibleDefaults,
  },
  category: 'Home-Entertainment',
  subcategory: 'Home-Entertainment.SmartHome',
  product1: '201807171',
  product2: '201807194',
  product3: '201807191',
};

describe('Wishlist Shopping Experience Functionality', () => {
  const unpreferredWishlist = 'unpreferred wishlist';
  const shoppingUnpreferred = 'shopping wishlist';
  const shoppingPreferred = 'shopping wishlist preferred';
  before(() => {
    createUserViaREST(_.user);
    LoginPage.navigateTo('/account/wishlists');
    at(LoginPage, page => {
      page.fillForm(_.user.login, _.user.password);
      page.submit().its('response.statusCode').should('equal', 200);
    });
    at(WishlistsOverviewPage, page => {
      page.addWishlist(unpreferredWishlist, false);
      page.addWishlist(shoppingUnpreferred, false);
    });
  });

  it('user adds a product from the product tile to wishlist (with selecting a wishlist)', () => {
    at(WishlistsOverviewPage, page => {
      page.header.gotoCategoryPage(_.category);
    });

    at(CategoryPage, page => page.gotoSubCategory(_.subcategory));
    at(FamilyPage, page =>
      page.productList.addToWishlist.addProductToWishlistFromList(_.product1, unpreferredWishlist)
    );
    at(WishlistsDetailsPage, page => page.listItemLinks.invoke('attr', 'href').should('contain', _.product1));
  });

  it('user adds a wishlist product to cart', () => {
    at(WishlistsDetailsPage, page => {
      page.addProductToBasket(_.product1, 4);
      page.header.miniCart.goToCart();
    });
    at(CartPage, page => {
      page.lineItems.contains(_.product1).should('exist');
      page.lineItems
        .contains(_.product1)
        .closest('[data-testing-id="product-list-item"]')
        .find('[data-testing-id="quantity"]')
        .should('have.value', '4');
    });
  });

  it('user adds a product to wishlist from shopping cart (with wishlist selection)', () => {
    at(CartPage, page => {
      page.addProductToWishlist();
      page.addToWishlist.addProductToWishlistFromPage(shoppingUnpreferred, true);
    });
    at(WishlistsDetailsPage, page => {
      page.listItemLinks.invoke('attr', 'href').should('contain', _.product1);
    });
  });

  it('user adds a product to wishlist from shopping cart (to a preferred wishlist without selection)', () => {
    at(WishlistsDetailsPage, page => page.header.gotoWishlists());
    at(WishlistsOverviewPage, page => {
      page.addWishlist(shoppingPreferred, true);
      page.header.miniCart.goToCart();
    });
    at(CartPage, page => {
      page.addProductToWishlist();
      page.addToWishlist.addProductToWishlistFromPage(shoppingPreferred, false);
    });
    at(WishlistsDetailsPage, page => page.listItemLinks.invoke('attr', 'href').should('contain', _.product1));
  });
});

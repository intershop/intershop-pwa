import { at } from '../../framework';
import { createUserViaREST } from '../../framework/users';
import { LoginPage } from '../../pages/account/login.page';
import { sensibleDefaults } from '../../pages/account/registration.page';
import { WishlistsDetailsPage } from '../../pages/account/wishlists-details.page';
import { WishlistsOverviewPage } from '../../pages/account/wishlists-overview.page';
import { CategoryPage } from '../../pages/shopping/category.page';
import { FamilyPage } from '../../pages/shopping/family.page';
import { ProductDetailPage } from '../../pages/shopping/product-detail.page';

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

describe('Wishlist MyAccount Functionality', () => {
  const preferredWishlist = 'preferred wishlist';
  const unpreferredWishlist = 'unpreferred wishlist';
  const editedWishlist = 'edited wishlist';
  const anotherWishlist = 'another wishlist';

  before(() => {
    createUserViaREST(_.user);
    LoginPage.navigateTo();
    at(LoginPage, page => {
      page.fillForm(_.user.login, _.user.password);
      page
        .submit()
        .its('status')
        .should('equal', 200);
    });
    WishlistsOverviewPage.navigateTo();
  });

  it('user creates an unpreferred wishlist', () => {
    at(WishlistsOverviewPage, page => {
      page.addWishlist(unpreferredWishlist, false);
      page.wishlistsArray.should('have.length', 1);
      page.wishlistsTitlesArray.should('contain', unpreferredWishlist);
    });
  });

  it('user creates a preferred wishlist', () => {
    at(WishlistsOverviewPage, page => {
      page.addWishlist(preferredWishlist, true);
      page.wishlistsArray.should('have.length', 2);
      page.wishlistsTitlesArray.should('contain', preferredWishlist);
    });
  });

  it('user deletes first wishlist', () => {
    at(WishlistsOverviewPage, page => {
      page.wishlistsArray.then($listItems => {
        const initLen = $listItems.length;
        const firstItem = $listItems.first();

        page.deleteWishlistById('unpreferred wishlist');
        page.wishlistsArray.should('have.length', initLen - 1);
        page.wishlistsArray.should('not.include', firstItem);
      });
    });
  });

  it('user adds 2 products from the product detail page to wishlist (using preferred wishlist)', () => {
    at(WishlistsOverviewPage, page => {
      page.addWishlist(anotherWishlist, false);
      page.header.gotoCategoryPage(_.category);
    });

    at(CategoryPage, page => page.gotoSubCategory(_.subcategory));
    at(FamilyPage, page => page.productList.gotoProductDetailPageBySku(_.product2));
    at(ProductDetailPage, page => {
      page.addProductToWishlist();
      page.addToWishlist.addProductToWishlistFromPage();
    });
    at(WishlistsDetailsPage, page => {
      page.listItemLink.invoke('attr', 'href').should('contain', _.product2);
      page.header.gotoCategoryPage(_.category);
    });

    at(CategoryPage, page => page.gotoSubCategory(_.subcategory));
    at(FamilyPage, page => page.productList.gotoProductDetailPageBySku(_.product1));
    at(ProductDetailPage, page => {
      page.addProductToWishlist();
      page.addToWishlist.addProductToWishlistFromPage();
    });
    at(WishlistsDetailsPage, page => {
      page.listItemLink.should('have.length', 2);
    });
  });

  it('user renames a wishlist and sets it to unpreferred', () => {
    at(WishlistsDetailsPage, page => {
      page.editWishlistDetails(editedWishlist, false);
      page.wishlistTitle.should('equal', editedWishlist);
      page.wishlistPreferredTextElement.should('not.exist');
    });
  });

  it('user deletes a product from wishlist', () => {
    at(WishlistsDetailsPage, page => {
      page.listItemLink.then($listItems => {
        const initLength = $listItems.length;
        page.deleteWishlist(_.product2);
        cy.wait(500);
        page.listItemLink.invoke('attr', 'href').should('not.contain', _.product2);
        page.listItemLink.should('have.length', initLength - 1);
      });
    });
  });

  it('user moves a product to another wishlist', () => {
    at(WishlistsDetailsPage, page => {
      page.moveProductToWishlist(_.product1, anotherWishlist);
      cy.wait(500);
      page.wishlistTitle.should('equal', anotherWishlist);
      page.getWishlistItemById(_.product1).should('exist');
    });
    WishlistsOverviewPage.navigateTo();
    at(WishlistsOverviewPage, page => {
      page.goToWishlistDetailLink(editedWishlist);
    });

    at(WishlistsDetailsPage, page => {
      page.listItem.should('not.exist');
    });
  });
});

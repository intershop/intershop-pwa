import { at } from '../../framework';
import { createB2BUserViaREST } from '../../framework/b2b-user';
import { LoginPage } from '../../pages/account/login.page';
import { sensibleDefaults } from '../../pages/account/registration.page';
import { CostCenterBuyersPage } from '../../pages/organizationmanagement/cost-center-buyers.page';
import { CostCenterCreatePage } from '../../pages/organizationmanagement/cost-center-create.page';
import { CostCenterDetailPage } from '../../pages/organizationmanagement/cost-center-detail.page';
import { CostCenterEditPage } from '../../pages/organizationmanagement/cost-center-edit.page';
import { CostCentersPage } from '../../pages/organizationmanagement/cost-centers.page';

// test for viewing functionality only
const _ = {
  user: {
    login: `test${new Date().getTime()}@testcity.de`,
    ...sensibleDefaults,
  },
  newCostCenter: {
    costCenterId: '100400',
    name: 'Marketing',
    budgetValue: 999,
    budgetPeriod: 'monthly',
  },
  editCostCenter: {
    name: 'Sales',
    budgetValue: '12000',
  },
  editBuyerBudget: {
    budgetValue: 998,
  },
};

describe('Cost Center Management - CRUD', () => {
  before(() => {
    createB2BUserViaREST(_.user);
  });

  it('should start cost center management by logging in', () => {
    LoginPage.navigateTo('/account/organization/cost-centers');
    at(LoginPage, page => {
      page.fillForm(_.user.login, _.user.password);
      page.submit().its('response.statusCode').should('equal', 200);
    });
    at(CostCentersPage, page => {
      page.emptyList.should('be.visible');
    });
  });

  it('should create a new cost center', () => {
    at(CostCentersPage, page => page.addCostCenter());
    at(CostCenterCreatePage, page => {
      page.fillForm({ ..._.newCostCenter, costCenterManager: _.user.login });
      page.submit();
    });
    at(CostCenterDetailPage, page => {
      page.id.should('contain', _.newCostCenter.costCenterId);
      page.name.should('contain', _.newCostCenter.name);
      page.owner.should('contain', `${_.user.firstName} ${_.user.lastName}`);
      page.emptyBuyerList.should('exist');
    });
  });

  it('should edit cost center details', () => {
    at(CostCenterDetailPage, page => page.editCostCenter());
    at(CostCenterEditPage, page => {
      page.editName(_.editCostCenter.name);
      page.editBudgetValue(_.editCostCenter.budgetValue);
      page.submit();
    });
    at(CostCenterDetailPage, page => {
      page.name.should('contain', _.editCostCenter.name);
    });
  });

  it('should assign a buyer to the cost center', () => {
    at(CostCenterDetailPage, page => page.addBuyers());
    at(CostCenterBuyersPage, page => {
      page.checkBuyer();
      page.submit();
    });
    at(CostCenterDetailPage, page => {
      page.emptyBuyerList.should('not.exist');
      page.buyerList.should('contain', `${_.user.firstName} ${_.user.lastName}`);
    });
  });

  it('should edit the cost center budget of a buyer', () => {
    at(CostCenterDetailPage, page => {
      page.editBuyerBudget(`${_.user.firstName} ${_.user.lastName}`, _.editBuyerBudget.budgetValue);
      page.buyerList.should('contain', _.editBuyerBudget.budgetValue);
    });
  });
  it('should remove a cost center buyer', () => {
    at(CostCenterDetailPage, page => {
      page.removeBuyer(`${_.user.firstName} ${_.user.lastName}`);
      page.emptyBuyerList.should('exist');
    });
  });

  it('should deactivate a cost center', () => {
    at(CostCenterDetailPage, page => page.goToCostCenterManagement());
    at(CostCentersPage, page => {
      page.costCentersList.should('contain', _.editCostCenter.name);
      page.costCentersList.should('not.contain', 'Inactive');

      page.deactivateCostcenter(_.editCostCenter.name);

      page.costCentersList.should('contain', 'Inactive');
    });
  });

  it('should delete a cost center', () => {
    at(CostCentersPage, page => {
      page.costCentersList.should('contain', _.editCostCenter.name);
      page.deleteCostCenter(_.editCostCenter.name);

      page.costCentersList.should('not.exist');
      page.emptyList.should('be.visible');
    });
  });
});

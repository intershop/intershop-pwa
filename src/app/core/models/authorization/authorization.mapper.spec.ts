import { TestBed } from '@angular/core/testing';

import { AuthorizationData } from './authorization.interface';
import { AuthorizationMapper } from './authorization.mapper';

describe('Authorization Mapper', () => {
  let authorizationMapper: AuthorizationMapper;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    authorizationMapper = TestBed.inject(AuthorizationMapper);
  });

  describe('fromData', () => {
    it('should throw when input is falsy', () => {
      expect(() => authorizationMapper.fromData(undefined)).toThrow();
    });

    it('should map empty role response to empty authorization data', () => {
      expect(authorizationMapper.fromData({ userRoles: [] })).toMatchInlineSnapshot(`
        Object {
          "permissionIDs": Array [],
          "roles": Array [],
        }
      `);
    });

    it('should map empty response to empty authorization data', () => {
      expect(authorizationMapper.fromData(({} as unknown) as AuthorizationData)).toMatchInlineSnapshot(`
        Object {
          "permissionIDs": Array [],
          "roles": Array [],
        }
      `);
    });

    it('should map incoming data to model data', () => {
      const data = ({
        type: 'UserRoles',
        userRoles: [
          {
            type: 'UserRole',
            roleID: 'APP_B2B_BUYER',
            roleDisplayName: 'Einkäufer',
            fixed: true,
            permissions: [
              {
                type: 'RolePermission',
                permissionID: 'APP_B2B_ASSIGN_COSTOBJECT_TO_BASKET',
                permissionDisplayName: 'Kostenobjekt zu Warenkorb zuordnen',
              },
              {
                type: 'RolePermission',
                permissionID: 'APP_B2B_ASSIGN_COSTOBJECT_TO_BASKETLINEITEM',
                permissionDisplayName: 'Kostenobjekt zu Warenkorbposition zuordnen',
              },
              {
                type: 'RolePermission',
                permissionID: 'APP_B2B_MANAGE_OWN_QUOTES',
                permissionDisplayName: 'Preisangebote erstellen',
              },
              { type: 'RolePermission', permissionID: 'APP_B2B_PURCHASE', permissionDisplayName: 'Einkäufe tätigen' },
              {
                type: 'RolePermission',
                permissionID: 'APP_B2B_VIEW_COSTOBJECT',
                permissionDisplayName: 'Kostenobjekte anzeigen',
              },
            ],
          },
          {
            type: 'UserRole',
            roleID: 'APP_B2B_APPROVER',
            roleDisplayName: 'Genehmiger',
            fixed: false,
            permissions: [
              {
                type: 'RolePermission',
                permissionID: 'APP_B2B_ASSIGN_COSTOBJECT_TO_BASKET',
                permissionDisplayName: 'Kostenobjekt zu Warenkorb zuordnen',
              },
              {
                type: 'RolePermission',
                permissionID: 'APP_B2B_ASSIGN_COSTOBJECT_TO_BASKETLINEITEM',
                permissionDisplayName: 'Kostenobjekt zu Warenkorbposition zuordnen',
              },
              {
                type: 'RolePermission',
                permissionID: 'APP_B2B_MANAGE_OWN_QUOTES',
                permissionDisplayName: 'Preisangebote erstellen',
              },
              {
                type: 'RolePermission',
                permissionID: 'APP_B2B_ORDER_APPROVAL',
                permissionDisplayName: 'Offene Bestellungen genehmigen',
              },
              { type: 'RolePermission', permissionID: 'APP_B2B_PURCHASE', permissionDisplayName: 'Einkäufe tätigen' },
              {
                type: 'RolePermission',
                permissionID: 'APP_B2B_VIEW_COSTOBJECT',
                permissionDisplayName: 'Kostenobjekte anzeigen',
              },
            ],
          },
        ],
      } as unknown) as AuthorizationData;
      const mapped = authorizationMapper.fromData(data);
      expect(mapped.roles).toMatchInlineSnapshot(`
        Array [
          Object {
            "displayName": "Einkäufer",
            "roleId": "APP_B2B_BUYER",
          },
          Object {
            "displayName": "Genehmiger",
            "roleId": "APP_B2B_APPROVER",
          },
        ]
      `);
      expect(mapped.permissionIDs).toMatchInlineSnapshot(`
        Array [
          "APP_B2B_ASSIGN_COSTOBJECT_TO_BASKET",
          "APP_B2B_ASSIGN_COSTOBJECT_TO_BASKETLINEITEM",
          "APP_B2B_MANAGE_OWN_QUOTES",
          "APP_B2B_PURCHASE",
          "APP_B2B_VIEW_COSTOBJECT",
          "APP_B2B_ORDER_APPROVAL",
        ]
      `);
    });
  });
});

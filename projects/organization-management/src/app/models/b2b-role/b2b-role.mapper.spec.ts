import { TestBed } from '@angular/core/testing';

import { B2bRoleData } from './b2b-role.interface';
import { B2bRoleMapper } from './b2b-role.mapper';

describe('B2b Role Mapper', () => {
  let b2bRoleMapper: B2bRoleMapper;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    b2bRoleMapper = TestBed.inject(B2bRoleMapper);
  });

  describe('fromData', () => {
    it('should throw when input is falsy', () => {
      expect(() => b2bRoleMapper.fromData(undefined)).toThrow();
    });

    it('should map empty role response to empty roles data', () => {
      expect(b2bRoleMapper.fromData([])).toBeEmpty();
    });

    it('should map incoming data to model data', () => {
      const data = [
        {
          roleID: 'APP_B2B_BUYER',
          roleDisplayName: 'Einkäufer',
          fixed: true,
          permissions: [
            { permissionDisplayName: 'Kostenobjekt zu Warenkorb zuordnen' },
            { permissionDisplayName: 'Kostenobjekt zu Warenkorbposition zuordnen' },
            { permissionDisplayName: 'Preisangebote erstellen' },
            { permissionDisplayName: 'Einkäufe tätigen' },
            { permissionDisplayName: 'Kostenobjekte anzeigen' },
          ],
        },
        {
          roleID: 'APP_B2B_APPROVER',
          roleDisplayName: 'Genehmiger',
          fixed: false,
          permissions: [
            { permissionDisplayName: 'Kostenobjekt zu Warenkorb zuordnen' },
            { permissionDisplayName: 'Kostenobjekt zu Warenkorbposition zuordnen' },
            { permissionDisplayName: 'Preisangebote erstellen' },
            { permissionDisplayName: 'Offene Bestellungen genehmigen' },
            { permissionDisplayName: 'Einkäufe tätigen' },
            { permissionDisplayName: 'Kostenobjekte anzeigen' },
          ],
        },
      ] as B2bRoleData[];
      const mapped = b2bRoleMapper.fromData(data);
      expect(mapped).toMatchInlineSnapshot(`
        Array [
          Object {
            "displayName": "Einkäufer",
            "fixed": true,
            "id": "APP_B2B_BUYER",
            "permissionDisplayNames": Array [
              "Kostenobjekt zu Warenkorb zuordnen",
              "Kostenobjekt zu Warenkorbposition zuordnen",
              "Preisangebote erstellen",
              "Einkäufe tätigen",
              "Kostenobjekte anzeigen",
            ],
          },
          Object {
            "displayName": "Genehmiger",
            "fixed": false,
            "id": "APP_B2B_APPROVER",
            "permissionDisplayNames": Array [
              "Offene Bestellungen genehmigen",
            ],
          },
        ]
      `);
    });
  });
});

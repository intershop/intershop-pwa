import sortTestbedMetadataArraysRule from '../src/rules/sort-testbed-metadata-arrays';

import testRule from './rule-tester';

testRule(sortTestbedMetadataArraysRule, {
  valid: [
    {
      name: 'should not report if imports are sorted correctly (simple)',
      filename: 'test.component.spec.ts',
      code: `
          TestBed.configureTestingModule({
            imports: [A,B]
          })
        `,
    },
    {
      name: 'should not report if imports are sorted correctly (complex)',
      filename: 'test.component.spec.ts',
      code: `
          TestBed.configureTestingModule({
            imports: [
              MockComponent(A),
              MockComponent(B),
            ]
          })
        `,
    },
  ],
  invalid: [
    {
      name: 'should sort imports (simple)',
      filename: 'test.component.spec.ts',
      code: `
          TestBed.configureTestingModule({
            imports: [B,A]
          })
        `,
      errors: [
        {
          messageId: 'sortTestBedMetadataArrays',
        },
      ],
      output: `
          TestBed.configureTestingModule({
            imports: [A,B]
          })
        `,
    },
    {
      name: 'should sort imports (complex)',
      filename: 'test.component.spec.ts',
      code: `
          TestBed.configureTestingModule({
            imports: [
              MockComponent(B),
              MockComponent(A),
            ]
          })
        `,
      errors: [
        {
          messageId: 'sortTestBedMetadataArrays',
        },
      ],
      output: `
          TestBed.configureTestingModule({
            imports: [
              MockComponent(A),
              MockComponent(B),
            ]
          })
        `,
    },
  ],
});

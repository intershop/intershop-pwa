import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { ContentPageTreeElement } from 'ish-core/models/content-page-tree/content-page-tree.model';
import { ContentStoreModule } from 'ish-core/store/content/content-store.module';
import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { StoreWithSnapshots, provideStoreSnapshots } from 'ish-core/utils/dev/ngrx-testing';
import { pageTree } from 'ish-core/utils/dev/test-data-utils';

import { loadContentPageTreeSuccess } from './page-tree.actions';
import { getContentPageTree, getPageTree } from './page-tree.selectors';

describe('Page Tree Selectors', () => {
  let store$: StoreWithSnapshots;
  let router: Router;

  let tree1: ContentPageTreeElement;
  let tree2: ContentPageTreeElement;
  let tree3: ContentPageTreeElement;
  let tree4: ContentPageTreeElement;
  let tree5: ContentPageTreeElement;
  let tree6: ContentPageTreeElement;

  beforeEach(() => {
    tree1 = { contentPageId: '1', path: ['1'], name: '1' } as ContentPageTreeElement;
    tree2 = { contentPageId: '1.1', path: ['1', '1.1'], name: '1.1' } as ContentPageTreeElement;
    tree3 = { contentPageId: '1.1.1', path: ['1', '1.1', '1.1.1'], name: '1.1.1' } as ContentPageTreeElement;
    tree4 = { contentPageId: '1.1.2', path: ['1', '1.1', '1.1.2'], name: '1.1.2' } as ContentPageTreeElement;
    tree5 = {
      contentPageId: '1.1.1.1',
      path: ['1', '1.1', '1.1.1', '1.1.1.1'],
      name: '1.1.1.1',
    } as ContentPageTreeElement;
    tree6 = { contentPageId: '2', path: ['2'], name: '2' } as ContentPageTreeElement;

    TestBed.configureTestingModule({
      imports: [
        ContentStoreModule.forTesting('pagetree'),
        CoreStoreModule.forTesting(['router']),
        RouterTestingModule.withRoutes([{ path: 'page/:contentPageId', children: [] }]),
      ],
      providers: [provideStoreSnapshots()],
    });

    store$ = TestBed.inject(StoreWithSnapshots);
    router = TestBed.inject(Router);
  });

  describe('with empty state', () => {
    it('should not select any selected page tree when used', () => {
      expect(getContentPageTree(tree1.contentPageId)(store$.state)).toBeUndefined();
    });
  });

  describe('state contains page tree', () => {
    beforeEach(() =>
      store$.dispatch(loadContentPageTreeSuccess({ pagetree: pageTree([tree1, tree2, tree3, tree4, tree5]) }))
    );

    it('should get all page trees with getPageTrees() selector', () => {
      expect(getPageTree(store$.state)).toMatchInlineSnapshot(`
        └─ 1
           └─ 1.1
              ├─ 1.1.1
              │  └─ 1.1.1.1
              └─ 1.1.2

      `);
    });

    describe('with page route', () => {
      it('should select content page tree of given uniqueId with children', fakeAsync(() => {
        router.navigateByUrl(`page/1`);
        tick(500);
        expect(getContentPageTree(tree1.contentPageId)(store$.state)).toMatchInlineSnapshot(`
          Object {
            "children": Array [
              Object {
                "children": Array [],
                "contentPageId": "1.1",
                "name": "1.1",
                "parent": "1",
                "path": Array [
                  "1",
                  "1.1",
                ],
                "pathElements": Array [
                  Object {
                    "contentPageId": "1",
                    "name": "1",
                    "path": Array [
                      "1",
                    ],
                  },
                  Object {
                    "contentPageId": "1.1",
                    "name": "1.1",
                    "path": Array [
                      "1",
                      "1.1",
                    ],
                  },
                ],
              },
            ],
            "contentPageId": "1",
            "name": "1",
            "parent": undefined,
            "path": Array [
              "1",
            ],
            "pathElements": Array [
              Object {
                "contentPageId": "1",
                "name": "1",
                "path": Array [
                  "1",
                ],
              },
            ],
          }
        `);
      }));

      it('should select content page tree of given uniqueId with children', fakeAsync(() => {
        router.navigateByUrl(`page/1.1`);
        tick(500);
        expect(getContentPageTree(tree1.contentPageId)(store$.state)).toMatchInlineSnapshot(`
          Object {
            "children": Array [
              Object {
                "children": Array [
                  Object {
                    "children": Array [],
                    "contentPageId": "1.1.1",
                    "name": "1.1.1",
                    "parent": "1.1",
                    "path": Array [
                      "1",
                      "1.1",
                      "1.1.1",
                    ],
                    "pathElements": Array [
                      Object {
                        "contentPageId": "1",
                        "name": "1",
                        "path": Array [
                          "1",
                        ],
                      },
                      Object {
                        "contentPageId": "1.1",
                        "name": "1.1",
                        "path": Array [
                          "1",
                          "1.1",
                        ],
                      },
                      Object {
                        "contentPageId": "1.1.1",
                        "name": "1.1.1",
                        "path": Array [
                          "1",
                          "1.1",
                          "1.1.1",
                        ],
                      },
                    ],
                  },
                  Object {
                    "children": Array [],
                    "contentPageId": "1.1.2",
                    "name": "1.1.2",
                    "parent": "1.1",
                    "path": Array [
                      "1",
                      "1.1",
                      "1.1.2",
                    ],
                    "pathElements": Array [
                      Object {
                        "contentPageId": "1",
                        "name": "1",
                        "path": Array [
                          "1",
                        ],
                      },
                      Object {
                        "contentPageId": "1.1",
                        "name": "1.1",
                        "path": Array [
                          "1",
                          "1.1",
                        ],
                      },
                      Object {
                        "contentPageId": "1.1.2",
                        "name": "1.1.2",
                        "path": Array [
                          "1",
                          "1.1",
                          "1.1.2",
                        ],
                      },
                    ],
                  },
                ],
                "contentPageId": "1.1",
                "name": "1.1",
                "parent": "1",
                "path": Array [
                  "1",
                  "1.1",
                ],
                "pathElements": Array [
                  Object {
                    "contentPageId": "1",
                    "name": "1",
                    "path": Array [
                      "1",
                    ],
                  },
                  Object {
                    "contentPageId": "1.1",
                    "name": "1.1",
                    "path": Array [
                      "1",
                      "1.1",
                    ],
                  },
                ],
              },
            ],
            "contentPageId": "1",
            "name": "1",
            "parent": undefined,
            "path": Array [
              "1",
            ],
            "pathElements": Array [
              Object {
                "contentPageId": "1",
                "name": "1",
                "path": Array [
                  "1",
                ],
              },
            ],
          }
        `);
      }));

      it('should select content page tree of given uniqueId with children', fakeAsync(() => {
        router.navigateByUrl(`page/1.1.1`);
        tick(500);
        expect(getContentPageTree(tree1.contentPageId)(store$.state)).toMatchInlineSnapshot(`
          Object {
            "children": Array [
              Object {
                "children": Array [
                  Object {
                    "children": Array [
                      Object {
                        "children": Array [],
                        "contentPageId": "1.1.1.1",
                        "name": "1.1.1.1",
                        "parent": "1.1.1",
                        "path": Array [
                          "1",
                          "1.1",
                          "1.1.1",
                          "1.1.1.1",
                        ],
                        "pathElements": Array [
                          Object {
                            "contentPageId": "1",
                            "name": "1",
                            "path": Array [
                              "1",
                            ],
                          },
                          Object {
                            "contentPageId": "1.1",
                            "name": "1.1",
                            "path": Array [
                              "1",
                              "1.1",
                            ],
                          },
                          Object {
                            "contentPageId": "1.1.1",
                            "name": "1.1.1",
                            "path": Array [
                              "1",
                              "1.1",
                              "1.1.1",
                            ],
                          },
                          Object {
                            "contentPageId": "1.1.1.1",
                            "name": "1.1.1.1",
                            "path": Array [
                              "1",
                              "1.1",
                              "1.1.1",
                              "1.1.1.1",
                            ],
                          },
                        ],
                      },
                    ],
                    "contentPageId": "1.1.1",
                    "name": "1.1.1",
                    "parent": "1.1",
                    "path": Array [
                      "1",
                      "1.1",
                      "1.1.1",
                    ],
                    "pathElements": Array [
                      Object {
                        "contentPageId": "1",
                        "name": "1",
                        "path": Array [
                          "1",
                        ],
                      },
                      Object {
                        "contentPageId": "1.1",
                        "name": "1.1",
                        "path": Array [
                          "1",
                          "1.1",
                        ],
                      },
                      Object {
                        "contentPageId": "1.1.1",
                        "name": "1.1.1",
                        "path": Array [
                          "1",
                          "1.1",
                          "1.1.1",
                        ],
                      },
                    ],
                  },
                  Object {
                    "children": Array [],
                    "contentPageId": "1.1.2",
                    "name": "1.1.2",
                    "parent": "1.1",
                    "path": Array [
                      "1",
                      "1.1",
                      "1.1.2",
                    ],
                    "pathElements": Array [
                      Object {
                        "contentPageId": "1",
                        "name": "1",
                        "path": Array [
                          "1",
                        ],
                      },
                      Object {
                        "contentPageId": "1.1",
                        "name": "1.1",
                        "path": Array [
                          "1",
                          "1.1",
                        ],
                      },
                      Object {
                        "contentPageId": "1.1.2",
                        "name": "1.1.2",
                        "path": Array [
                          "1",
                          "1.1",
                          "1.1.2",
                        ],
                      },
                    ],
                  },
                ],
                "contentPageId": "1.1",
                "name": "1.1",
                "parent": "1",
                "path": Array [
                  "1",
                  "1.1",
                ],
                "pathElements": Array [
                  Object {
                    "contentPageId": "1",
                    "name": "1",
                    "path": Array [
                      "1",
                    ],
                  },
                  Object {
                    "contentPageId": "1.1",
                    "name": "1.1",
                    "path": Array [
                      "1",
                      "1.1",
                    ],
                  },
                ],
              },
            ],
            "contentPageId": "1",
            "name": "1",
            "parent": undefined,
            "path": Array [
              "1",
            ],
            "pathElements": Array [
              Object {
                "contentPageId": "1",
                "name": "1",
                "path": Array [
                  "1",
                ],
              },
            ],
          }
        `);
      }));
    });
  });

  it('should merge trees together when tree contains same path', () => {
    store$.dispatch(loadContentPageTreeSuccess({ pagetree: pageTree([tree1, tree2]) }));
    expect(Object.keys(getPageTree(store$.state).nodes)).toMatchInlineSnapshot(`
      Array [
        "1",
        "1.1",
      ]
    `);
    expect(getPageTree(store$.state).rootIds).toHaveLength(1);

    store$.dispatch(loadContentPageTreeSuccess({ pagetree: pageTree([tree1, tree2, tree3, tree4]) }));
    expect(Object.keys(getPageTree(store$.state).nodes)).toMatchInlineSnapshot(`
      Array [
        "1",
        "1.1",
        "1.1.1",
        "1.1.2",
      ]
    `);
    expect(getPageTree(store$.state).rootIds).toHaveLength(1);
  });

  it('should add new tree when tree contains a new rootId', () => {
    store$.dispatch(loadContentPageTreeSuccess({ pagetree: pageTree([tree1, tree2]) }));
    expect(getPageTree(store$.state).rootIds).toMatchInlineSnapshot(`
      Array [
        "1",
      ]
    `);

    store$.dispatch(loadContentPageTreeSuccess({ pagetree: pageTree([tree6]) }));
    expect(getPageTree(store$.state).rootIds).toMatchInlineSnapshot(`
      Array [
        "1",
        "2",
      ]
    `);
  });

  it('should do nothing when an undefined tree should be added', () => {
    store$.dispatch(loadContentPageTreeSuccess({ pagetree: pageTree([tree1, tree2]) }));
    const state1 = store$.state;

    store$.dispatch(loadContentPageTreeSuccess({ pagetree: undefined }));
    expect(store$.state).toEqual(state1);
  });
});

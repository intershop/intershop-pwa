const html1 = `
<ish-root>
    <div>
        <!-- Kommentar -->
        <ish-content-include data-sfe='{ "id": "includefoo", "displayType": "Include" }'>
            <ish-content-include data-sfe='{ "id": "aaaa", "displayType": "Include" }'>
                Text
            </ish-content-include>
        </ish-content-include>
        <div>
            Text2
            <ish-content-include data-sfe='{ "id": "xxxx", "displayType": "Include" }'>
                <ish-cms-abc data-sfe='{ "id": "yyyy", "displayType": "Pagelet" }'></ish-cms-abc>
            </ish-content-include>
        </div>
    </div>
</ish-root>
`;

const tree1: object = {
  name: 'ish-root',
  children: [
    {
      name: 'div',
      children: [
        {
          name: 'ish-content-include',
          sfeMetadata: { id: 'includefoo', displayType: 'Include' },
          children: [
            { name: 'ish-content-include', sfeMetadata: { id: 'aaaa', displayType: 'Include' }, children: [] },
          ],
        },
        {
          name: 'div',
          children: [
            {
              name: 'ish-content-include',
              sfeMetadata: { id: 'xxxx', displayType: 'Include' },
              children: [{ name: 'ish-cms-abc', sfeMetadata: { id: 'yyyy', displayType: 'Pagelet' }, children: [] }],
            },
          ],
        },
      ],
    },
  ],
};

const reducedTree1: object = {
  children: [
    {
      id: 'includefoo',
      displayType: 'Include',
      children: [{ id: 'aaaa', displayType: 'Include', children: [] }],
    },
    {
      id: 'xxxx',
      displayType: 'Include',
      children: [{ id: 'yyyy', displayType: 'Pagelet', children: [] }],
    },
  ],
};

////////////////////////////////////////////////

const html2 = `
<ish-root>
    <ish-content-include data-sfe='{ "id": "test3", "displayType": "Include" }'>
        <div>
            <div>
                <ish-any>
                    <ish-any3>
                        <ish-content-include data-sfe='{ "id": "moreinclude", "displayType": "Include" }'>
                    </ish-any3>
                </ish-any>
            </div>
        </div>
        <span>Text</span>
    </ish-content-include>
</ish-root>
`;

const tree2: object = {
  name: 'ish-root',
  children: [
    {
      name: 'ish-content-include',
      sfeMetadata: { id: 'test3', displayType: 'Include' },
      children: [
        {
          name: 'div',
          children: [
            {
              name: 'div',
              children: [
                {
                  name: 'ish-any',
                  children: [
                    {
                      name: 'ish-any3',
                      children: [
                        {
                          name: 'ish-content-include',
                          sfeMetadata: { id: 'moreinclude', displayType: 'Include' },
                          children: [],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

const reducedTree2: object = {
  children: [
    { id: 'test3', displayType: 'Include', children: [{ id: 'moreinclude', displayType: 'Include', children: [] }] },
  ],
};

////////////////////////////////////////////////

const html3 = `
<ish-root>
    <ish-content-include data-sfe='{ "id": "test3", "displayType": "Include" }'>
        <div>
            <div>
                <ish-any></ish-any>
            </div>
        </div>
        <span>Text</span>
    </ish-content-include>
    <ish-other>Text</ish-other>
</ish-root>
`;

const tree3: object = {
  name: 'ish-root',
  children: [
    {
      name: 'ish-content-include',
      sfeMetadata: { id: 'test3', displayType: 'Include' },
      children: [],
    },
  ],
};

const reducedTree3: object = { children: [{ id: 'test3', displayType: 'Include', children: [] }] };

//////////////////////

export const htmlComplex = `
<div>
    <ish-root>
        <div>
            <ish-abcdefg>
                <ish-content-include data-sfe='{ "id": "xxxx", "displayType": "Include" }'>
                    <ish-cms-abc data-sfe='{ "id": "yyyy", "displayType": "Pagelet" }'>
                        <ish-cms-kkk data-sfe='{ "id": "abcc", "displayType": "Pagelet" }'></ish-cms-kkk>
                    </ish-cms-abc>
                    <ish-cms-def data-sfe='{ "id": "deff", "displayType": "Pagelet" }'>
                        <ish-other>
                            <div>other div</div>
                        </ish-other>
                    </ish-cms-def>
                </ish-content-include>
                <ish-test>
                    <ish-content-include data-sfe='{ "id": "includefoo", "displayType": "Include" }'>
                        <ish-cms-aaa data-sfe='{ "id": "aaaax", "displayType": "Pagelet" }'></ish-cms-aaa>
                        <ish-cms-bbb data-sfe='{ "id": "bbbbx", "displayType": "Pagelet" }'></ish-cms-bbb>
                    </ish-content-include>
                </ish-test>
            </ish-abcdefg>
            <ish-test1></ish-test1>
            <ish-test2>
                <div>
                    <ish-content-include data-sfe='{ "id": "includexyz", "displayType": "Include" }'>
                        <ish-any2>
                            <ish-content-include data-sfe='{ "id": "moreinclude1", "displayType": "Include" }'>
                        </ish-any2>
                    </ish-content-include>
                </div>
                <span>Text</span>
            </ish-test2>
            <ish-content-include data-sfe='{ "id": "test3", "displayType": "Include" }'>
                <div>
                    <div>
                        <ish-any>
                            <ish-any3>
                                <ish-content-include data-sfe='{ "id": "moreinclude2", "displayType": "Include" }'>
                            </ish-any3>
                        </ish-any>
                    </div>
                </div>
                <span>Text</span>
            </ish-content-include>
        </div>
    </ish-root>
</div>
`;

export const reducedTreeComplex: object = {
  children: [
    {
      id: 'xxxx',
      displayType: 'Include',
      children: [
        {
          id: 'yyyy',
          displayType: 'Pagelet',
          children: [{ id: 'abcc', displayType: 'Pagelet', children: [] }],
        },
        { id: 'deff', displayType: 'Pagelet', children: [] },
      ],
    },
    {
      id: 'includefoo',
      displayType: 'Include',
      children: [
        { id: 'aaaax', displayType: 'Pagelet', children: [] },
        { id: 'bbbbx', displayType: 'Pagelet', children: [] },
      ],
    },
    {
      id: 'includexyz',
      displayType: 'Include',
      children: [{ id: 'moreinclude1', displayType: 'Include', children: [] }],
    },
    { id: 'test3', displayType: 'Include', children: [{ id: 'moreinclude2', displayType: 'Include', children: [] }] },
  ],
};

//////////////////////////////////

export const domDataProvider = [
  [
    'text/comment nodes and nested sfe elements',
    {
      html: html1,
      tree: tree1,
      reducedTree: reducedTree1,
    },
  ],
  [
    'nested nodes containing sfe elements',
    {
      html: html2,
      tree: tree2,
      reducedTree: reducedTree2,
    },
  ],
  [
    'nested nodes containing no sfe elements',
    {
      html: html3,
      tree: tree3,
      reducedTree: reducedTree3,
    },
  ],
];

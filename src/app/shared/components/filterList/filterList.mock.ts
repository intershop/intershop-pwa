export const data = {
	'filterEntries': [
		{
			'name': 'Category',
			'type': 'SearchIndexFilter',
			'id': 'CategoryUUIDLevelMulti',
			'displayType': 'text_clear',
			'selectionType': 'taxonomic',
			'limitCount': -1,
			'minCount': 1,
			'scope': 'Global',
			'facets': [
				{
					'name': 'Cameras',
					'type': 'Facet',
					'count': 4,
					'link': {
						'type': 'Link',
						'uri': 'inSPIRED-inTRONICS-Site/-/filters/' +
						+'CategoryUUIDLevelMulti;SearchParameter=JkBRdWVyeVRlcm09KiZDb250ZXh0Q2F0ZWdvcnlVVUlEPVpZNV9BQUFCYmdRQUFBRmQ1OUFGcVZWXyZPbmxpbmVGbGFnPTE=',
						'title': 'Cameras'
					},
					'hits': {
						'type': 'Link',
						'uri': 'inSPIRED-inTRONICS-Site/-/filters/' +
						+'CategoryUUIDLevelMulti;SearchParameter=JkBRdWVyeVRlcm09KiZDb250ZXh0Q2F0ZWdvcnlVVUlEPVpZNV9BQUFCYmdRQUFBRmQ1OUFGcVZWXyZPbmxpbmVGbGFnPTE=/hits',
						'title': 'Cameras'
					},
					'selected': true
				},
				{
					'name': 'Camcorders',
					'type': 'Facet',
					'count': 1,
					'level': 1,
					'link': {
						'type': 'Link',
						'uri': 'inSPIRED-inTRONICS-Site/-/filters/CategoryUUIDLevelMulti;' +
						+'SearchParameter=JkBRdWVyeVRlcm09KiZDb250ZXh0Q2F0ZWdvc' +
						+'nlVVUlEPTRuNV9BQUFCR01zQUFBRmQ4RU1GcVZXQSZPbmxpbmVGbGFnPTE=',
						'title': 'Camcorders'
					},
					'hits': {
						'type': 'Link',
						'uri': 'inSPIRED-inTRONICS-Site/-/filters/CategoryUUIDLevelMulti;' +
						+'SearchParameter=JkBRdWVyeVRlcm09KiZDb250ZXh0Q2F0ZWdvcnlVVUlEPTRu' +
						+'NV9BQUFCR01zQUFBRmQ4RU1GcVZXQSZPbmxpbmVGbGFnPTE=/hits',
						'title': 'Camcorders'
					},
					'selected': true
				}
			]
		},
		{
			'name': 'Brand',
			'type': 'SearchIndexFilter',
			'id': 'ManufacturerName',
			'displayType': 'text_clear',
			'selectionType': 'single',
			'limitCount': 7,
			'minCount': 1,
			'scope': 'Global',
			'facets': [
				{
					'name': 'Canon',
					'type': 'Facet',
					'count': 2,
					'link': {
						'type': 'Link',
						'uri': 'inSPIRED-inTRONICS-Site/-/filters/ManufacturerName;' +
						+'SearchParameter=JkBRdWVyeVRlcm09KiZDb250ZXh0Q2F0ZWdvcnlVVUl' +
						+'EPVpZNV9BQUFCYmdRQUFBRmQ1OUFGcVZWXyZNYW51ZmFjdHVyZXJOYW1lPUNhbm9uJk9ubGluZUZsYWc9MQ==',
						'title': 'Canon'
					},
					'hits': {
						'type': 'Link',
						'uri': 'inSPIRED-inTRONICS-Site/-/filters/ManufacturerName;' +
						+'SearchParameter=JkBRdWVyeVRlcm09KiZDb250ZXh0Q2F0ZWdvcnlVVUl' +
						+'EPVpZNV9BQUFCYmdRQUFBRmQ1OUFGcVZWXyZNYW51ZmFjdHVyZXJOYW1lPUNhbm9uJk9ubGluZUZsYWc9MQ==/hits',
						'title': 'Canon'
					},
					'selected': false
				},
				{
					'name': 'Kodak',
					'type': 'Facet',
					'count': 1,
					'link': {
						'type': 'Link',
						'uri': 'inSPIRED-inTRONICS-Site/-/filters/ManufacturerName;' +
						+'SearchParameter=JkBRdWVyeVRlcm09KiZDb250ZXh0Q2F0ZWdvcnlVVUl' +
						+'EPVpZNV9BQUFCYmdRQUFBRmQ1OUFGcVZWXyZNYW51ZmFjdHVyZXJOYW1lPUtvZGFrJk9ubGluZUZsYWc9MQ==',
						'title': 'Kodak'
					},
					'hits': {
						'type': 'Link',
						'uri': 'inSPIRED-inTRONICS-Site/-/filters/ManufacturerName;' +
						+'SearchParameter=JkBRdWVyeVRlcm09KiZDb250ZXh0Q2F0ZWdvcnlVVUl' +
						+'EPVpZNV9BQUFCYmdRQUFBRmQ1OUFGcVZWXyZNYW51ZmFjdHVyZXJOYW1lPUtvZGFrJk9ubGluZUZsYWc9MQ==/hits',
						'title': 'Kodak'
					},
					'selected': false
				}
			]
		},
		{
			'name': 'Price',
			'type': 'SearchIndexFilter',
			'id': 'ProductSalePriceGross',
			'displayType': 'text_clear',
			'selectionType': 'multiple_or',
			'limitCount': -1,
			'minCount': 1,
			'scope': 'Global',
			'facets': [
				{
					'name': '$ 25 - $ 50',
					'type': 'Facet',
					'count': 1,
					'link': {
						'type': 'Link',
						'uri': 'inSPIRED-inTRONICS-Site/-/filters/ProductSalePriceGross;' +
						+'SearchParameter=JkBRdWVyeVRlcm09KiZDb250ZXh0Q2F0ZWdvcnlVVUlEPVpZ' +
						+'NV9BQUFCYmdRQUFBRmQ1OUFGcVZWXyZPbmxpbmVGbGFnPTEmUHJvZHVjdFNhbGVQcmljZUdyb3NzPSU1QjI1LjArVE8rNDkuOTklNUQ=',
						'title': '$ 25 - $ 50'
					},
					'hits': {
						'type': 'Link',
						'uri': 'inSPIRED-inTRONICS-Site/-/filters/ProductSalePriceGross;' +
						+'SearchParameter=JkBRdWVyeVRlcm09KiZDb250ZXh0Q2F0ZWdvcnlVVUlEPVpZN' +
						+'V9BQUFCYmdRQUFBRmQ1OUFGcVZWXyZPbmxpbmVGbGFnPTEmUHJvZHVjdFNhbGVQcmljZUdyb3NzPSU1QjI1LjArVE8rNDkuOTklNUQ=/hits',
						'title': '$ 25 - $ 50'
					},
					'selected': false
				},
				{
					'name': '$ 100 - $ 250',
					'type': 'Facet',
					'count': 2,
					'link': {
						'type': 'Link',
						'uri': 'inSPIRED-inTRONICS-Site/-/filters/ProductSalePriceGross;' +
						+'SearchParameter=JkBRdWVyeVRlcm09KiZDb250ZXh0Q2F0ZWdvcn' +
						+'lVVUlEPVpZNV9BQUFCYmdRQUFBRmQ1OUFGcVZWXyZPbmxpbmVGbGFnPTEm' +
						+'UHJvZHVjdFNhbGVQcmljZUdyb3NzPSU1QjEwMC4wK1RPKzI0OS45OSU1RA==',
						'title': '$ 100 - $ 250'
					},
					'hits': {
						'type': 'Link',
						'uri': 'inSPIRED-inTRONICS-Site/-/filters/ProductSalePriceGross;' +
						+'SearchParameter=JkBRdWVyeVRlcm09KiZDb250ZXh0Q2F0ZWdvcnlVVUlEPVpZN' +
						+'V9BQUFCYmdRQUFBRmQ1OUFGcVZWXyZPbmxpbmVGbGFnPTEmUHJvZHVjdFNhbGVQcmljZUdyb3NzPSU1QjEwMC4wK1RPKzI0OS45OSU1RA==/hits',
						'title': '$ 100 - $ 250'
					},
					'selected': false
				},
				{
					'name': '$ 250 - $ 500',
					'type': 'Facet',
					'count': 1,
					'link': {
						'type': 'Link',
						'uri': 'inSPIRED-inTRONICS-Site/-/filters/ProductSalePriceGross;' +
						+'SearchParameter=JkBRdWVyeVRlcm09KiZDb250ZXh0Q2F0ZWdvcnlVVUlEPVpZNV9BQUFCYmdRQUFBR' +
						+'mQ1OUFGcVZWXyZPbmxpbmVGbGFnPTEmUHJvZHVjdFNhbGVQcmljZUdyb3NzPSU1QjI1MC4wK1RPKzQ5OS45OSU1RA==',
						'title': '$ 250 - $ 500'
					},
					'hits': {
						'type': 'Link',
						'uri': 'inSPIRED-inTRONICS-Site/-/filters/ProductSalePriceGross;' +
						+'SearchParameter=JkBRdWVyeVRlcm09KiZDb250ZXh0Q2F0ZWdvcnlVVUlEPVpZNV9BQUFCYmdRQUFBRmQ1' +
						+'OUFGcVZWXyZPbmxpbmVGbGFnPTEmUHJvZHVjdFNhbGVQcmljZUdyb3NzPSU1QjI1MC4wK1RPKzQ5OS45OSU1RA==/hits',
						'title': '$ 250 - $ 500'
					},
					'selected': false
				}
			]
		},
		{
			'name': 'Color',
			'type': 'SearchIndexFilter',
			'displayType': 'swatch',
			'selectionType': 'multiple_or',
			'limitCount': -1,
			'id': 'list-of-color',
			'minCount': 1,
			'scope': 'Global',
			'facets': [
				{
					'name': 'Blue',
					'type': 'Facet',
					'count': 1,
					'link': {
						'type': 'Link',
						'uri': 'inSPIRED-inTRONICS-Site/-/filters/;' +
						+'SearchParameter=JkBRdWVyeVRlcm09KiZDb2xvdXJfb2ZfcHJvZH' +
						+'VjdD1CbHVlJkNvbnRleHRDYXRlZ29yeVVVSUQ9Wlk1X0FBQUJiZ1FBQUFGZDU5QUZxVlZfJk9ubGluZUZsYWc9MQ==',
						'title': 'Blue'
					},
					'hits': {
						'type': 'Link',
						'uri': 'inSPIRED-inTRONICS-Site/-/filters/;' +
						+'SearchParameter=JkBRdWVyeVRlcm09KiZDb2xvdXJfb2ZfcHJvZHVjdD1CbHVlJkN' +
						+'vbnRleHRDYXRlZ29yeVVVSUQ9Wlk1X0FBQUJiZ1FBQUFGZDU5QUZxVlZfJk9ubGluZUZsYWc9MQ==/hits',
						'title': 'Blue'
					},
					'selected': false
				},
				{
					'name': 'Red',
					'type': 'Facet',
					'count': 2,
					'link': {
						'type': 'Link',
						'uri': 'inSPIRED-inTRONICS-Site/-/filters/;' +
						+'SearchParameter=JkBRdWVyeVRlcm09KiZDb2xvdXJfb' +
						+'2ZfcHJvZHVjdD1SZWQmQ29udGV4dENhdGVnb3J5VVVJRD1aWTVfQUFBQmJnUUFBQUZkNTl' +
						+'BRnFWVl8mT25saW5lRmxhZz0x',
						'title': 'Red'
					},
					'hits': {
						'type': 'Link',
						'uri': 'inSPIRED-inTRONICS-Site/-/filters/;' +
						+'SearchParameter=JkBRdWVyeVRlcm09KiZDb2xvdXJf' +
						+'b2ZfcHJvZHVjdD1SZWQmQ29udGV4dENhdGVnb3J5VVVJRD1aWTVfQUFBQmJnUUFBQUZk' +
						+'NTlBRnFWVl8mT25saW5lRmxhZz0x/hits',
						'title': 'Red'
					},
					'selected': false
				},
				{
					'name': 'White',
					'type': 'Facet',
					'count': 2,
					'link': {
						'type': 'Link',
						'uri': 'inSPIRED-inTRONICS-Site/-/filters/;' +
						+'SearchParameter=JkBRdWVyeVRlcm09KiZDb2xvdXJ' +
						+'fb2ZfcHJvZHVjdD1XaGl0ZSZDb250ZXh0Q2F0ZWdvcnlVVUlEPVpZNV9BQUFCYmdRQUF' +
						+'BRmQ1OUFGcVZWXyZPbmxpbmVGbGFnPTE=',
						'title': 'White'
					},
					'hits': {
						'type': 'Link',
						'uri': 'inSPIRED-inTRONICS-Site/-/filters/;' +
						+'SearchParameter=JkBRdWVyeVRlcm09KiZDb2xvdXJfb2ZfcHJvZHVjdD1XaGl0ZS' +
						+'ZDb250ZXh0Q2F0ZWdvcnlVVUlEPVpZNV9BQUFCYmdRQUFBRmQ1OUFGcVZWXyZPbmxpbmVGbGFnPTE=/hits',
						'title': 'White'
					},
					'selected': false
				}
			]
		}
	],
	'type': 'ResourceCollection',
	'name': 'filters'
}

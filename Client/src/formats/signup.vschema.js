import vschema from 'value-schema'; // eslint-disable-line import/no-extraneous-dependencies

export default {
  Type: vschema.string({
    only: ['signup', 'signin'],
  }),
  RedirectURI: vschema.string({
    pattern: vschema.STRING.PATTERN.URI,
    trims: true,
    maxLength: 255,
  }),
  ID: vschema.string({
    trims: true,
    maxLength: 31,
  }),
  Scope: vschema.array({
    separatedBy: ',',
    toArray: true,
    each: {
      schema: vschema.string({
        only: [
          'none',
          'fullname',
          'nickname',
          'phonenumber',
          'birthday',
          'postcode',
          'address',
          'email',
        ],
      }),
    },
  }),
};

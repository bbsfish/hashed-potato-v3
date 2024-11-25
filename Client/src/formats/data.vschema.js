import vschema from 'value-schema'; // eslint-disable-line import/no-extraneous-dependencies

export default {
  redirect_uri: vschema.string({
    pattern: vschema.STRING.PATTERN.URI,
    trims: true,
    maxLength: 255,
  }),
  requester_id: vschema.string({
    trims: true,
    maxLength: 31,
  }),
  scope: vschema.array({
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

const bcrypt = require("bcryptjs");

exports.convertTimestampToDate = ({ created_at, ...otherProperties }) => {
  if (!created_at) return { ...otherProperties };
  return { created_at: new Date(created_at), ...otherProperties };
};

exports.createRef = (arr, key, value) => {
  return arr.reduce((ref, element) => {
    ref[element[key]] = element[value];
    return ref;
  }, {});
};

exports.formatComments = (comments, idLookup) => {
  return comments.map(({ created_by, belongs_to, ...restOfComment }) => {
    const article_id = idLookup[belongs_to];
    return {
      article_id,
      author: created_by,
      ...this.convertTimestampToDate(restOfComment),
    };
  });
};

exports.hash = (password) => {
  return bcrypt
    .hash(password, 5)
    .then((hash) => {
      return hash;
    })
    .catch((err) => console.error(err.message));
};

exports.checkHash = (password, hash) => {
  return bcrypt
    .compare(password, hash)
    .then((match) => {
      // console.log("Match: ", match);
      return match;
    })
    .catch((err) => console.error(err.message));
};

export const markdownEscape = (text: string, skips: string[] = []): string => {
  var replacements = [
    [/\*/g, "\\*", "asterisks"],
    [/#/g, "\\#", "number signs"],
    [/\//g, "\\/", "slashes"],
    [/\(/g, "\\(", "parentheses"],
    [/\)/g, "\\)", "parentheses"],
    [/\[/g, "\\[", "square brackets"],
    [/\]/g, "\\]", "square brackets"],
    [/</g, "&lt;", "angle brackets"],
    [/>/g, "&gt;", "angle brackets"],
    [/_/g, "\\_", "underscores"],
    [/-/g, "\\-", "hyphens"],
    [/\!/g, "\\!", "exclamation marks"],
    [/\./g, "\\.", "points"],
    [/\+/g, "\\+", "plus sign"],
  ];

  return replacements.reduce(function (string, replacement) {
    var name = replacement[2] as string;
    return name && skips.indexOf(name) !== -1
      ? string
      : string.replace(replacement[0], replacement[1] as string);
  }, text);
};

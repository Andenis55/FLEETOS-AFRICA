const fs = require('fs');
const axios = require('axios');

const [,, prNumber] = process.argv;
const lhr = JSON.parse(fs.readFileSync('./.lighthouseci/lhr-0.report.json', 'utf8'));

const formatScore = (label, value) => {
  const emoji = value >= 0.9 ? '✅' : value >= 0.8 ? '⚠️' : '❌';
  return `${emoji} **${label}:** ${(value * 100).toFixed(0)}%`;
};

const commentBody = `
🔍 **Lighthouse Audit Results**
${formatScore('Performance', lhr.categories.performance.score)}
${formatScore('Accessibility', lhr.categories.accessibility.score)}
${formatScore('Best Practices', lhr.categories['best-practices'].score)}
${formatScore('SEO', lhr.categories.seo.score)}

📄 [Full report](${lhr.finalUrl})
`;

axios.post(
  `https://api.github.com/repos/${process.env.GITHUB_REPOSITORY}/issues/${prNumber}/comments`,
  { body: commentBody },
  {
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      'Content-Type': 'application/json'
    }
  }
).then(() => {
  console.log('✅ Lighthouse comment posted');
}).catch(err => {
  console.error('❌ Failed to post comment:', err.response?.data || err.message);
});
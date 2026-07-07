const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const GEN = path.join(ROOT, 'src', 'pages', 'generated');

const mapping = {
  'Ch15OverviewPage.tsx': { section: '', subs: ['18.1 Coupling Flows', '18.2 Autoregressive Flows', '18.3 Continuous Flows'] },
  'Ch15CouplingFlowsPage.tsx': { section: '18.1', subs: ['18.1 Coupling Flows', 'Supplement: coupling layers', 'Supplement: affine coupling', 'Supplement: RealNVP'] },
  'Ch15AutoregressiveFlowsPage.tsx': { section: '18.2', subs: ['18.2 Autoregressive Flows', 'Supplement: autoregressive factorization', 'Supplement: MAF and IAF'] },
  'Ch15ContinuousFlowsPage.tsx': { section: '18.3', subs: ['18.3 Continuous Flows', '18.3.1 Neural differential equations', '18.3.2 Neural ODE backpropagation', '18.3.3 Neural ODE flows'] },
  'Ch16OverviewPage.tsx': { section: '', subs: ['19.1 Deterministic Autoencoders', '19.2 Variational Autoencoders'] },
  'Ch16DeterministicAutoencodersPage.tsx': { section: '19.1', subs: ['19.1 Deterministic Autoencoders', '19.1.1 Linear autoencoders', '19.1.2 Deep autoencoders', '19.1.3 Sparse autoencoders', '19.1.4 Denoising autoencoders', '19.1.5 Masked autoencoders'] },
  'Ch16VariationalAutoencodersPage.tsx': { section: '19.2', subs: ['19.2 Variational Autoencoders', '19.2.1 Amortized inference', '19.2.2 The reparameterization trick'] },
  'Ch17OverviewPage.tsx': { section: '', subs: ['20.1 Forward Encoder', '20.2 Reverse Decoder', '20.3 Score Matching', '20.4 Guided Diffusion'] },
  'Ch17ForwardEncoderPage.tsx': { section: '20.1', subs: ['20.1 Forward Encoder', '20.1.1 Diffusion kernel', '20.1.2 Conditional distribution', 'Supplement: noise schedule'] },
  'Ch17ReverseDecoderPage.tsx': { section: '20.2', subs: ['20.2 Reverse Decoder', '20.2.1 Training the decoder', '20.2.2 Evidence lower bound', '20.2.3 Rewriting the ELBO', '20.2.4 Predicting the noise', '20.2.5 Generating new samples'] },
  'Ch17ScoreMatchingPage.tsx': { section: '20.3', subs: ['20.3 Score Matching', '20.3.1 Score loss function', '20.3.2 Modified score loss', '20.3.3 Noise variance', '20.3.4 Stochastic differential equations'] },
  'Ch17GuidedDiffusionPage.tsx': { section: '20.4', subs: ['20.4 Guided Diffusion', '20.4.1 Classifier guidance', '20.4.2 Classifier-free guidance'] },
  'Ch14OverviewPage.tsx': { section: '', subs: ['17.1 Adversarial Training', '17.2 Image GANs'] },
  'Ch14AdversarialTrainingPage.tsx': { section: '17.1', subs: ['17.1 Adversarial Training', '17.1.1 Loss function', '17.1.2 GAN training in practice'] },
  'Ch14ImageGansPage.tsx': { section: '17.2', subs: ['17.2 Image GANs', '17.2.1 CycleGAN', 'Supplement: DCGAN', 'Supplement: conditional GAN'] },
};

function replaceArray(src, field, arr) {
  const re = new RegExp(`${field}:\\s*\\[[^\\]]*\\]`);
  return src.replace(re, `${field}: [${arr.map((s) => JSON.stringify(s)).join(', ')}]`);
}

for (const [file, data] of Object.entries(mapping)) {
  const fp = path.join(GEN, file);
  if (!fs.existsSync(fp)) continue;
  let src = fs.readFileSync(fp, 'utf8');
  src = replaceArray(src, 'textbookSubsections', data.subs);
  fs.writeFileSync(fp, src, 'utf8');
  console.log('Updated', file);
}

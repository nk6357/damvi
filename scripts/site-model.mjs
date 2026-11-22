import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import { otherServices } from '../public/other-services.js';
import { legalDocuments } from '../public/legal-documents.js';
import { serviceSearchContent, relatedServiceSlugs, serviceSearchLabels, serviceProblemAnswers } from '../public/service-search-content.js';

// Execute only our pure template functions, not browser event handlers.
// This keeps the generated HTML identical to the content visitors see.
export async function siteModel() {
  const source = await readFile('public/app.js', 'utf8');
  const prefix = source.slice(0, source.indexOf('let renderVersion = 0;')).replace(/^import .*;\n/gm, '');
  if (!prefix || !source.includes('let renderVersion = 0;')) throw new Error('Site renderer boundary not found');
  const context = vm.createContext({ URL, Date, serviceSearchContent, relatedServiceSlugs, serviceSearchLabels, serviceProblemAnswers, document: { querySelector: () => null } });
  const model = vm.runInContext(prefix + '\n({config,goals,siteNav,home,goalPage,servicePage,projectsPage,legalPage,notFound})', context);
  model.config.otherServices = otherServices;
  model.services = [...model.config.services, ...otherServices];
  model.routes = ['/', '/projects', '/services/other', ...model.services.map(s => '/services/' + s.slug), ...Object.keys(model.goals).map(s => '/goals/' + s), ...Object.keys(legalDocuments).map(s => '/' + s)];
  model.aliases = Object.fromEntries(model.services.flatMap(s => (s.aliases || []).map(alias => ['/services/' + alias, '/services/' + s.slug])));
  model.content = path => path === '/' ? model.home() : path === '/projects' ? model.projectsPage() : legalDocuments[path.slice(1)] ? model.legalPage(legalDocuments[path.slice(1)]) : path.startsWith('/goals/') && model.goals[path.split('/').pop()] ? model.goalPage(path.split('/').pop()) : path.startsWith('/services/') && (path === '/services/other' || model.services.some(s => s.slug === path.split('/').pop())) ? model.servicePage(path.split('/').pop()) : model.notFound();
  return model;
}

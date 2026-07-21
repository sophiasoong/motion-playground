import { useMemo, useState } from 'react';
import PageTitle from './PageTitle';
import Table, { type TableColumn } from './Table';
import Toolbar from './Toolbar';
import AddBrandModal from './AddBrandModal';
import BrandSubmittedModal from './BrandSubmittedModal';
import './BrandPage.css';

/* ── Data (from Home / Product / Brand) ─────────────────────────── */

type BrandStatus = 'New' | 'Approved' | 'Rejected';

interface Brand {
  code: string;
  nameEn: string;
  nameZh: string;
  nameZhSimpl: string;
  status: BrandStatus;
}

const BRANDS: Brand[] = [
  { code: 'BRD-0001', nameEn: 'Aurora Home',        nameZh: '曙光家居', nameZhSimpl: '曙光家居', status: 'New' },
  { code: 'BRD-0002', nameEn: 'Nordic Living',       nameZh: '北歐生活', nameZhSimpl: '北欧生活', status: 'New' },
  { code: 'BRD-0003', nameEn: 'PureLeaf Tea Co.',    nameZh: '純葉茶莊', nameZhSimpl: '纯叶茶庄', status: 'Approved' },
  { code: 'BRD-0004', nameEn: 'Everstride',          nameZh: '恆步',     nameZhSimpl: '恒步',     status: 'Approved' },
  { code: 'BRD-0005', nameEn: 'Glow Theory',         nameZh: '光理論',   nameZhSimpl: '光理论',   status: 'New' },
  { code: 'BRD-0006', nameEn: 'TerraCraft',          nameZh: '土藝工房', nameZhSimpl: '土艺工房', status: 'Rejected' },
  { code: 'BRD-0007', nameEn: 'BlueHarbor Foods',    nameZh: '藍港食品', nameZhSimpl: '蓝港食品', status: 'New' },
  { code: 'BRD-0008', nameEn: 'Silken & Co.',        nameZh: '絲研',     nameZhSimpl: '丝研',     status: 'Approved' },
  { code: 'BRD-0009', nameEn: 'Northline Sports',    nameZh: '北線運動', nameZhSimpl: '北线运动', status: 'New' },
  { code: 'BRD-0010', nameEn: 'Cedarwood Kitchen',   nameZh: '雪松廚房', nameZhSimpl: '雪松厨房', status: 'Rejected' },
];

const STATUS_DOT_CLASS: Record<BrandStatus, string> = {
  New: 'table-badge__dot--info',
  Approved: 'table-badge__dot--success',
  Rejected: 'table-badge__dot--danger',
};

const COLUMNS: TableColumn<Brand>[] = [
  { key: 'code', header: 'Brand Code' },
  { key: 'nameEn', header: 'Brand Name (English)' },
  { key: 'nameZh', header: 'Brand Name (Chinese)' },
  { key: 'nameZhSimpl', header: 'Brand Name (Simpl. Chinese)' },
  {
    key: 'status',
    header: 'Status',
    render: row => (
      <span className="table-badge">
        <span className={`table-badge__dot ${STATUS_DOT_CLASS[row.status]}`} aria-hidden="true" />
        {row.status}
      </span>
    ),
  },
];

const SCOPE_OPTIONS = [
  { value: 'code', label: 'Brand Code' },
  { value: 'name', label: 'Brand Name' },
] as const;

const NAME_SEARCH_KEYS = ['nameEn', 'nameZh', 'nameZhSimpl'] as const satisfies readonly (keyof Brand)[];

const STATUS_OPTIONS = [
  { value: 'New', label: 'New' },
  { value: 'Approved', label: 'Approved' },
  { value: 'Rejected', label: 'Rejected' },
];

/* ── Component ───────────────────────────────────────────────────── */

const INITIAL_FILTERS: { scope: string; query: string; status: string } = {
  scope: SCOPE_OPTIONS[0].value,
  query: '',
  status: '',
};
const PAGE_SIZE_OPTIONS = [10, 25, 50];

export default function BrandPage() {
  const [brandList, setBrandList] = useState<Brand[]>(BRANDS);
  const [scope, setScope] = useState<string>(INITIAL_FILTERS.scope);
  const [query, setQuery] = useState(INITIAL_FILTERS.query);
  const [status, setStatus] = useState(INITIAL_FILTERS.status);
  const [applied, setApplied] = useState(INITIAL_FILTERS);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[0]);
  const [bannerVisible, setBannerVisible] = useState(true);
  const [addBrandOpen, setAddBrandOpen] = useState(false);
  const [brandSubmittedOpen, setBrandSubmittedOpen] = useState(false);

  const filteredBrands = useMemo(() => {
    return brandList.filter(brand => {
      const matchesQuery = applied.query
        ? applied.scope === 'name'
          ? NAME_SEARCH_KEYS.some(key => brand[key].toLowerCase().includes(applied.query.toLowerCase()))
          : String(brand[applied.scope as keyof Brand]).toLowerCase().includes(applied.query.toLowerCase())
        : true;
      const matchesStatus = applied.status ? brand.status === applied.status : true;
      return matchesQuery && matchesStatus;
    });
  }, [applied, brandList]);

  const totalPages = Math.max(1, Math.ceil(filteredBrands.length / pageSize));
  const brands = filteredBrands.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSearch = () => {
    setApplied({ scope, query, status });
    setCurrentPage(1);
  };

  const handleReset = () => {
    setScope(INITIAL_FILTERS.scope);
    setQuery(INITIAL_FILTERS.query);
    setStatus(INITIAL_FILTERS.status);
    setApplied(INITIAL_FILTERS);
    setCurrentPage(1);
  };

  const handleAddBrand = (brand: { nameEn: string; nameZh: string; nameZhSimpl: string }) => {
    const code = `BRD-${String(brandList.length + 1).padStart(4, '0')}`;
    setBrandList(prev => [{ code, ...brand, status: 'New' }, ...prev]);
    setBrandSubmittedOpen(true);
  };

  return (
    <main className="brand-page">
      <PageTitle
        breadcrumbItems={[
          { label: 'Home' },
          { label: 'Product' },
          { label: 'Brand' },
        ]}
        title="Brand"
        action={{ label: 'Add Brand', onClick: () => setAddBrandOpen(true) }}
      />

      <AddBrandModal
        open={addBrandOpen}
        onClose={() => setAddBrandOpen(false)}
        onSubmit={handleAddBrand}
      />

      <BrandSubmittedModal
        open={brandSubmittedOpen}
        onClose={() => setBrandSubmittedOpen(false)}
      />

      {bannerVisible && (
        <div className="brand-page__banner">
          <span className="icon icon--sm brand-page__banner-icon" aria-hidden="true">info</span>
          <span className="brand-page__banner-text">
            After creating a new brand, please remember to submit the Zendesk webform so our team
            can verify the brand details.
          </span>
          <a
            className="brand-page__banner-action"
            href="https://cloud.marketing.hktvmall.com/HKTVmall_Zendesk_Cannotfindcorrectbrandcolorsizecategoryorigin_instructions/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Submit Zendesk Webform
          </a>
          <button
            type="button"
            className="brand-page__banner-close"
            aria-label="Dismiss"
            onClick={() => setBannerVisible(false)}
          >
            <span className="icon icon--sm" aria-hidden="true">close</span>
          </button>
        </div>
      )}

      <Table
        columns={COLUMNS}
        data={brands}
        rowKey={row => row.code}
        toolbar={
          <Toolbar
            scopeOptions={[...SCOPE_OPTIONS]}
            scope={scope}
            onScopeChange={setScope}
            query={query}
            onQueryChange={setQuery}
            onSearch={handleSearch}
            placeholder="Search…"
            chipOptions={STATUS_OPTIONS}
            chipLabel="Status"
            chipValue={status}
            onChipChange={setStatus}
            onReset={handleReset}
          />
        }
        resultsLabel={
          filteredBrands.length === 0
            ? '0 results'
            : `${(currentPage - 1) * pageSize + 1}–${Math.min(currentPage * pageSize, filteredBrands.length)} of ${filteredBrands.length} results`
        }
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        pageSize={pageSize}
        onPageSizeChange={size => { setPageSize(size); setCurrentPage(1); }}
        pageSizeOptions={PAGE_SIZE_OPTIONS}
      />
    </main>
  );
}

import { Routes, Route } from 'react-router-dom';
// 
// 
import PageMain from '../pages/page.main';
import PageCases from '../pages/page.cases';
import PageRating from '../pages/page.rating';
import PageProfile from '../pages/page.profile';
// -
import PageBuy from '../pages/page.buy';
import CaseSpinner from '../pages/case.spinner';
import PageItem from "../pages/page.item";
import PageWithdraw from "../pages/page.withdraw";
import PagePurchase from "../pages/page.purchase";
import PagePurchaseSucces from "../pages/page.purchase.success";


export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<PageMain />} />
      <Route path="/cases" element={<PageCases />} />
      <Route path="/rating" element={<PageRating />} />
      <Route path="/profile" element={<PageProfile />} />
      <Route path="/buy" element={<PageBuy />} />
      <Route path="/case_spinner/:id" element={<CaseSpinner />} />
      <Route path="/item/:id" element={<PageItem />} />
      <Route path="/withdraw/:item_id" element={<PageWithdraw />} />
      <Route path="/withdraw" element={<PageWithdraw />} />
      <Route path="/purchase/:id" element={<PagePurchase />} />
      <Route path="/purchase_success/" element={<PagePurchaseSucces />} />
    </Routes>
  );
}

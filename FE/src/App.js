import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Header from "./component/Header";
import Footer from "./component/Footer";
import ChatBox from "./component/ChatBox";

// Pages khách hàng
import HomePage from "./pages/HomePage";
import SignUp from "./pages/SignUp";
import OTP from "./pages/OTP";
import SignIn from "./pages/SignIn";
import About from "./pages/AboutPage";
import GuidePage from "./pages/GuidePage";
import PricePage from "./pages/PricePage";
import SamplingInstructionsPage from "./pages/SamplingInstructionsPage";
import SampleBloodPage from "./pages/SampleBloodPage";
import SampleMucosaPage from "./pages/SampleMucosaPage";
import SampleHairPage from "./pages/SampleHairPage";
import SampleNailPage from "./pages/SampleNailPage";
import SampleNavelPage from "./pages/SampleNavelpage";
import SampleSpecialPage from "./pages/SampleSpecialPage";
import ServicesPage from "./pages/ServicesPage";
import CivilServicePage from "./pages/CivilServicePage";
import AdminstrativeServicePage from "./pages/AdminstrativeServicePage";
import HomeDNATest from "./pages/HomeDNATest";
import SendDNATest from "./pages/SendDNATest";
import HomeServicePage from "./pages/HomeServicePage";
import ResetPassword from "./pages/ResetPassword";
import ProfilePage from "./pages/ProfilePage";
import UpdateProfilePage from "./pages/UpdateProfilePage";
import PaymentPage from "./pages/paymentPay";
import FormTesting from "./pages/FormTesting";
import TestingHistory from "./pages/TestingHistory";
import HistoryList from "./pages/HistoryList";
import TestResult from "./pages/TestResult";
import TermAndServices from "./pages/TermAndServices";
import CustomerRate from "./pages/CustomerRate";

// Pages quản lý / test
import ManagerPage from "./pages/manager/ManagerPage";
import ManagerServicePage from "./pages/manager/ManagerServicePage";
import ManagerStaffPage from "./pages/manager/ManagerStaffPage";
import ManagerAdminPage from "./pages/admin/ManagerAdminPage";
import ManagerAccountPage from "./pages/admin/ManagerAccountPage";

// Pages staff
import StaffPage from "./pages/staff/StaffPage";
import ManagerBookingPage from "./pages/staff/ManagerBookingPage";
import StaffChatPage from "./pages/staff/StaffChatPage";
import ManageKitSamplePage from "./pages/staff/ManageKitSamplePage";

function App() {
  const location = useLocation();
  const isInternal =
    location.pathname.startsWith("/manager") ||
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/staff");

  return (
    <>
      {/* Header và Chat chỉ hiển thị ngoài hệ thống */}
      {!isInternal && (
        <>
          <Header />
          <ChatBox />
        </>
      )}

      <Routes>
        {/* Các route dành cho Customer */}
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/otp" element={<OTP />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/about" element={<About />} />
        <Route path="/guide" element={<GuidePage />} />
        <Route path="/price" element={<PricePage />} />
        <Route path="/mau" element={<SampleBloodPage />} />
        <Route path="/huong-dan" element={<SamplingInstructionsPage />} />
        <Route path="/niem-mac" element={<SampleMucosaPage />} />
        <Route path="/toc" element={<SampleHairPage />} />
        <Route path="/mong" element={<SampleNailPage />} />
        <Route path="/ron" element={<SampleNavelPage />} />
        <Route path="/dac-biet" element={<SampleSpecialPage />} />
        <Route path="/dich-vu" element={<ServicesPage />} />
        <Route path="/dan-su" element={<CivilServicePage />} />
        <Route path="/hanh-chinh" element={<AdminstrativeServicePage />} />
        <Route path="/service-page" element={<HomeServicePage />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/update-profile" element={<UpdateProfilePage />} />
        <Route path="/nha" element={<HomeDNATest />} />
        <Route path="/gui-mau" element={<SendDNATest />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/form" element={<FormTesting />} />
        <Route path="/lich-su" element={<HistoryList />} />
        <Route path="/lich-su/:id" element={<TestingHistory />} />
        <Route path="/ket-qua" element={<TestResult />} />
        <Route path="/term" element={<TermAndServices />} />
        <Route path="/danh-gia/:bookingId" element={<CustomerRate />} />

        {/* Manager routes */}
        <Route path="/manager" element={<ManagerPage />}>
          <Route path="service" element={<ManagerServicePage />} />
          <Route path="staff" element={<ManagerStaffPage />} />
          <Route path="booking" element={<ManagerBookingPage />} /> 
        </Route>

        {/* Admin routes */}
        <Route path="/admin" element={<ManagerAdminPage />}>
          <Route path="account" element={<ManagerAccountPage />} />
          <Route path="service" element={<ManagerServicePage />} />
        </Route>

        {/* Staff routes */}
        <Route path="/staff" element={<StaffPage />}>
          <Route path="booking" element={<ManagerBookingPage />} />
          <Route path="staff-chat" element={<StaffChatPage />} />
          <Route path="kitnsample" element={<ManageKitSamplePage />} />
        </Route>
      </Routes>

      {/* Footer chỉ hiển thị ngoài hệ thống */}
      {!isInternal && <Footer />}
    </>
  );
}

export default App;

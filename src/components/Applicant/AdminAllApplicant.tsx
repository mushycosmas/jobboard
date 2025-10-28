"use client";

import React, { useState, useEffect, useContext } from "react";
import { useSession } from "next-auth/react";
import { UniversalDataContext } from "@/context/UniversalDataContext";

import ApplicantList from "./ApplicantList";
import FilterModal from "./FilterModal";
import ApplicantProfileModal from "./ApplicantProfileModal";

interface Props {
  employerId?: string | number;
}

const AdminAllApplicant: React.FC<Props> = ({ employerId }) => {
  const { data: session, status } = useSession();
  const {
    countries,
    states,
    genders,
    experiences,
    maritalStatus,
    categories,
    positions,
    savedCollections,
  } = useContext(UniversalDataContext);

  const [applicants, setApplicants] = useState<any[]>([]);
  const [allApplicants, setAllApplicants] = useState<any[]>([]); // full raw data
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [filters, setFilters] = useState({
    country_id: "",
    region_id: "",
    gender_id: "",
    experience_id: "",
    marital_id: "",
    first_name: "",
    last_name: "",
    email: "",
  });

  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState<any>(null);


  useEffect(() => {
    

    const loadApplicants = async () => {
      try {
        const res = await fetch("/api/applicant/profile/all");
        if (!res.ok) throw new Error("Failed to fetch applicants");
        const data = await res.json();

        setAllApplicants(data || []);

        // Normalize for list
        const normalized = (data || []).map((item: any) => ({
          id: item.profile.id,
          first_name: item.profile.first_name,
          last_name: item.profile.last_name,
          email: item.profile.email,
          phone_number: item.profile.phone,
          address: item.profile.address,
          totalExperience: item.profile.totalExperience || "",
          region_name: item.profile.region_name || "",
          logo: item.profile.logo || null,
        }));

        setApplicants(normalized);

        const perPage = 10;
        setPagination({
          page: 1,
          totalPages: Math.ceil(normalized.length / perPage),
        });
      } catch (err) {
        console.error("Error fetching applicants:", err);
      }
    };

    loadApplicants();
  }, []);

  // Open modal with full applicant data
  const handleRowClick = (applicantId: number | string) => {
    const found = allApplicants.find((a) => a.profile.id === applicantId);
    setSelectedApplicant(found || null);
    setShowProfileModal(true);
  };

  const handleNextPage = () => {
    if (pagination.page < pagination.totalPages) {
      setPagination((prev) => ({ ...prev, page: prev.page + 1 }));
    }
  };

  const handlePreviousPage = () => {
    if (pagination.page > 1) {
      setPagination((prev) => ({ ...prev, page: prev.page - 1 }));
    }
  };

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleFilterSubmit = () => {
    setPagination((prev) => ({ ...prev, page: 1 }));
    setShowFilterModal(false);
  };

  const handleFilterReset = () => {
    setFilters({
      country_id: "",
      region_id: "",
      gender_id: "",
      experience_id: "",
      marital_id: "",
      first_name: "",
      last_name: "",
      email: "",
    });
    setPagination((prev) => ({ ...prev, page: 1 }));
    setShowFilterModal(false);
  };

  if (status === "loading") return <div>Loading applicants...</div>;
  if (status === "unauthenticated") return <div>Please log in to view applicants.</div>;

  return (
    <div>
      <ApplicantList
        applicants={applicants}
        pagination={{
          page: pagination.page,
          hasPrevPage: pagination.page > 1,
          hasNextPage: pagination.page < pagination.totalPages,
        }}
        onRowClick={handleRowClick}
        onNextPage={handleNextPage}
        onPreviousPage={handlePreviousPage}
        setShowFilterModal={setShowFilterModal}
      />

      {showFilterModal && (
        <FilterModal
          filters={filters}
          handleFilterChange={handleFilterChange}
          handleFilterSubmit={handleFilterSubmit}
          handleFilterReset={handleFilterReset}
          countries={countries}
          states={states}
          genders={genders}
          experiences={experiences}
          maritalStatus={maritalStatus}
          setShowFilterModal={setShowFilterModal}
        />
      )}

      {showProfileModal && selectedApplicant && (
        <ApplicantProfileModal
          applicantData={selectedApplicant} // Pass full object
          experiences={selectedApplicant.experiences}
          skills={selectedApplicant.skills}
          socialMediaLinks={selectedApplicant.socialMediaLinks}
          categories={categories}
          positions={positions}
          savedCollections={savedCollections}
          
          setShowProfileModal={setShowProfileModal}
        />
      )}
    </div>
  );
};

export default AdminAllApplicant;

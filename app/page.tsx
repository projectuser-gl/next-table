"use client"
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Pagination } from '@/components/ui/pagination';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import { Filter, ChevronUp, ChevronDown, ImagePlus } from 'lucide-react';
import { useState } from 'react';

const SearchBar = ({ onSearch }) => (
  <div className="relative h-9 w-[240px]">
    <Input
      type="text"
      placeholder="Search in list..."
      className="h-full w-full gap-1"
      onChange={(e) => onSearch(e.target.value)}
    />
  </div>
);

const FilterButton = () => (
  <Button 
    variant="outline" 
    className="h-9 w-[82px] gap-1 px-3 flex items-center justify-center text-[#818898]"
  >
    <Filter className="h-4 w-4" />
    Filter
  </Button>
);

const SortButton = ({ currentSort, onSort }) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button 
        variant="outline" 
        className="h-9 w-[105px] gap-1 px-3 flex items-center justify-center text-[#818898]"
      >
        Sort A-Z
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuItem onClick={() => onSort('company', 'asc')}>Company A to Z</DropdownMenuItem>
      <DropdownMenuItem onClick={() => onSort('company', 'desc')}>Company Z to A</DropdownMenuItem>
      <DropdownMenuItem onClick={() => onSort('publishDate', 'desc')}>Newest</DropdownMenuItem>
      <DropdownMenuItem onClick={() => onSort('publishDate', 'asc')}>Oldest</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

const JobFormContent = ({ initialData, onSubmit, dialogClose }) => {
  const [formData, setFormData] = useState(initialData || {
    company: '',
    companyLogo: '',
    jobName: '',
    description: '',
    workType: '',
  });

  const [previewUrl, setPreviewUrl] = useState(initialData?.companyLogo || '');

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
        setFormData({ ...formData, companyLogo: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const jobData = {
      ...formData,
      status: initialData ? initialData.status : 'DRAFT',
      publishDate: initialData ? initialData.publishDate : new Date().toLocaleDateString('en-GB'),
      createdBy: initialData ? initialData.createdBy : 'Marie S.',
    };
    onSubmit(jobData);
    dialogClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Company Logo</label>
        <div className="flex items-center gap-4">
          {previewUrl ? (
            <div className="relative w-12 h-12 group">
              <img 
                src={previewUrl} 
                alt="Preview" 
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div 
                className="absolute inset-0 bg-black bg-opacity-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                onClick={() => {
                  setPreviewUrl('');
                  setFormData({ ...formData, companyLogo: '' });
                }}
              >
                <span className="text-white text-xs">Remove</span>
              </div>
            </div>
          ) : (
            <label className="w-12 h-12 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors">
              <ImagePlus className="w-6 h-6 text-gray-400" />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
          )}
          <span className="text-sm text-gray-500">Upload company logo</span>
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Company</label>
        <Input
          value={formData.company}
          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
          placeholder="Enter company name"
          required
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Job Title</label>
        <Input
          value={formData.jobName}
          onChange={(e) => setFormData({ ...formData, jobName: e.target.value })}
          placeholder="Enter job title"
          required
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Description</label>
        <Input
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Enter job description"
          required
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Work Type</label>
        <Input
          value={formData.workType}
          onChange={(e) => setFormData({ ...formData, workType: e.target.value })}
          placeholder="e.g., Remote, Hybrid, On-site"
          required
        />
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={dialogClose}>
          Cancel
        </Button>
        <Button type="submit">
          {initialData ? 'Update Job' : 'Create Job'}
        </Button>
      </DialogFooter>
    </form>
  );
};

const DeleteConfirmationDialog = ({ isOpen, onClose, onConfirm }) => (
  <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Delete Job</DialogTitle>
      </DialogHeader>
      <div className="py-4">
        <p>Are you sure you want to delete this job? This action cannot be undone.</p>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button variant="destructive" onClick={onConfirm}>Delete</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export default function Home() {
  const [jobs, setJobs] = useState([
    {
      id: 1,
      company: 'Meta',
      companyLogo: './meta-logo.png',
      jobName: 'Ethical Hacker',
      description: 'Lorem ipsum dolor sit amet.',
      status: 'DRAFT',
      workType: 'Remote',
      publishDate: '13 Oct 2023',
      createdBy: 'Marie S.',
    }
  ]);

  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [searchTerm, setSearchTerm] = useState('');
  const [editingJob, setEditingJob] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const handleSort = (key, direction) => {
    setSortConfig({ key, direction });
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleCreateJob = (newJob) => {
    const jobWithId = { ...newJob, id: jobs.length + 1 };
    setJobs([...jobs, jobWithId]);
    setIsCreateDialogOpen(false);
  };

  const handleEditJob = (jobData) => {
    setJobs(jobs.map(job => job.id === editingJob.id ? { ...jobData, id: job.id } : job));
    setEditingJob(null);
  };

  const handleDeleteClick = (job) => {
    setJobToDelete(job);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    setJobs(jobs.filter(job => job.id !== jobToDelete.id));
    setIsDeleteDialogOpen(false);
    setJobToDelete(null);
  };

  const getSortedAndFilteredJobs = () => {
    let filteredJobs = [...jobs];

    if (searchTerm) {
      filteredJobs = filteredJobs.filter(job => 
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.jobName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (sortConfig.key && sortConfig.direction) {
      filteredJobs.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return filteredJobs;
  };

  const sortedAndFilteredJobs = getSortedAndFilteredJobs();

  return (
    <div className="p-6 bg-white">
      <div className="flex flex-col gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Jobs</h1>
          <p className="text-gray-500 mt-1">Learn and discover about that page informations.</p>
        </div>
      
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <SearchBar onSearch={handleSearch} />
            <FilterButton />
            <SortButton currentSort={sortConfig} onSort={handleSort} />
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                variant="default" 
                className="h-9 w-[120px] gap-1.5 px-2.5 rounded-tl-md"
                onClick={() => setIsCreateDialogOpen(true)}
              >
                + Create Job
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Job</DialogTitle>
              </DialogHeader>
              <JobFormContent 
                onSubmit={handleCreateJob} 
                dialogClose={() => setIsCreateDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="relative overflow-x-auto">
        <div className="max-h-[400px] overflow-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b-0">
                <TableHead 
                  className="bg-[#F6F8FA] text-[#818898] text-sm cursor-pointer sticky left-0 z-30"
                  style={{ backgroundColor: '#F6F8FA' }}
                  onClick={() => handleSort('company', sortConfig.direction === 'asc' ? 'desc' : 'asc')}
                >
                  Company
                  {sortConfig.key === 'company' && (
                    sortConfig.direction === 'asc' ? <ChevronUp className="inline ml-1" /> : <ChevronDown className="inline ml-1" />
                  )}
                </TableHead>
                <TableHead className="bg-[#F6F8FA] text-[#818898] text-sm min-w-[200px]">Job Name</TableHead>
                <TableHead className="bg-[#F6F8FA] text-[#818898] text-sm min-w-[100px]">Status</TableHead>
                <TableHead className="bg-[#F6F8FA] text-[#818898] text-sm min-w-[120px]">Work Type</TableHead>
                <TableHead 
                  className="bg-[#F6F8FA] text-[#818898] text-sm cursor-pointer min-w-[120px]"
                  onClick={() => handleSort('publishDate', sortConfig.direction === 'asc' ? 'desc' : 'asc')}
                >
                  Publish Date
                  {sortConfig.key === 'publishDate' && (
                    sortConfig.direction === 'asc' ? <ChevronUp className="inline ml-1" /> : <ChevronDown className="inline ml-1" />
                  )}
                </TableHead>
                <TableHead className="bg-[#F6F8FA] text-[#818898] text-sm min-w-[150px]">Created by</TableHead>
                <TableHead 
                  className="bg-[#F6F8FA] text-[#818898] w-[32px] sticky right-0 z-30"
                  style={{ backgroundColor: '#F6F8FA' }}
                />
              </TableRow>
            </TableHeader>
            <TableBody className="text-sm">
              {sortedAndFilteredJobs.map((job) => (
                <TableRow key={job.id} className="h-[60px] border-b border-gray-300">
                  <TableCell 
                    className="py-3 gap-3 sticky left-0 bg-white z-20"
                  >
                    <div className="flex items-center gap-3">
                      {job.companyLogo ? (
                        <img 
                          src={job.companyLogo} 
                          alt={`${job.company} logo`}
                          className="w-8 h-8 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                          <span className="text-gray-400 text-xs">{job.company.charAt(0)}</span>
                        </div>
                      )}
                      {job.company}
                    </div>
                  </TableCell>
                  <TableCell className="py-3 gap-3">
                    <div>{job.jobName}</div>
                    <span className="text-[12px] text-gray-400">{job.description}</span>
                  </TableCell>
                  <TableCell className="py-3 gap-3">
                    <Badge 
                      variant="outline" 
                      className="text-sm bg-[#1D4F810A] w-[59px] h-[20px] px-2 py-0.5 rounded-full"
                    >
                      {job.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-3 gap-3">{job.workType}</TableCell>
                  <TableCell className="py-3 gap-3">{job.publishDate}</TableCell>
                  <TableCell className="py-3 gap-3">
                    <div className="flex items-center space-x-2">
                      <img 
                        src="./avatar2.png" 
                        alt="Marie S."
                        className="h-6 w-6 rounded-full object-cover" 
                      />
                      <span>{job.createdBy}</span>
                    </div>
                  </TableCell>
                  <TableCell 
                    className="w-8 text-right sticky right-0 bg-white z-20"
                  >
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          className="flex items-center justify-center w-8 h-8 p-[6px_0_0_0] gap-1 rounded-tl-md"
                          style={{
                            boxShadow: '0px 0px 0px 1px #12376914, 0px 1px 2px 0px #A4ACB93D',
                          }}
                        >
                          <span className="w-[3px] h-[3px] bg-gray-500 rounded-full"></span>
                          <span className="w-[3px] h-[3px] bg-gray-500 rounded-full"></span>
                          <span className="w-[3px] h-[3px] bg-gray-500 rounded-full"></span>
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="text-sm">
                        <DropdownMenuItem>Details</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setEditingJob(job)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteClick(job)}>Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="flex justify-between items-center mt-4">
        <Pagination pageCount={6} currentPage={3} />
      </div>

      {/* Edit Dialog */}
      {editingJob && (
        <Dialog open={!!editingJob} onOpenChange={() => setEditingJob(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Job</DialogTitle>
            </DialogHeader>
            <JobFormContent 
              initialData={editingJob}
              onSubmit={handleEditJob}
              dialogClose={() => setEditingJob(null)}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
import * as React from "react";
import { Search, Filter, Eye, UserX } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { usersData, type User, type UserStatus } from "@/data/usersData";

const UsersListPage = () => {
  const [searchValue, setSearchValue] = React.useState("");
  const [filterStatus, setFilterStatus] = React.useState("all");

  // Filter users based on search and status
  const filteredUsers = React.useMemo(() => {
    return usersData.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        user.email.toLowerCase().includes(searchValue.toLowerCase()) ||
        user.phone.toLowerCase().includes(searchValue.toLowerCase());

      const matchesStatus =
        filterStatus === "all" || user.status === filterStatus;

      return matchesSearch && matchesStatus;
    });
  }, [searchValue, filterStatus]);

  // Calculate statistics
  const stats = React.useMemo(() => {
    return {
      total: usersData.length,
      active: usersData.filter((u) => u.status === "active").length,
      blocked: usersData.filter((u) => u.status === "blocked").length,
    };
  }, []);

  // Get initials from name
  const getInitials = (name: string) => {
    const parts = name.split(" ");
    return parts.map((part) => part[0]).join("");
  };

  // Get status badge styling
  const getStatusBadgeClass = (status: UserStatus) => {
    return status === "active"
      ? "bg-green-100 text-green-700 hover:bg-green-100"
      : "bg-red-100 text-red-700 hover:bg-red-100";
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Users</h1>
        <p className="text-gray-500 mt-1">Manage customer accounts</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-6">
        {/* Total Users */}
        <Card className="bg-white">
          <CardContent className="p-6">
            <p className="text-sm text-gray-600 mb-2">Total Users</p>
            <p className="text-4xl font-bold text-gray-900">{stats.total}</p>
          </CardContent>
        </Card>

        {/* Active Users */}
        <Card className="bg-white">
          <CardContent className="p-6">
            <p className="text-sm text-gray-600 mb-2">Active Users</p>
            <p className="text-4xl font-bold text-green-600">{stats.active}</p>
          </CardContent>
        </Card>

        {/* Blocked Users */}
        <Card className="bg-white">
          <CardContent className="p-6">
            <p className="text-sm text-gray-600 mb-2">Blocked Users</p>
            <p className="text-4xl font-bold text-red-600">{stats.blocked}</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card className="bg-white">
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search users by name, email, or phone..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="pl-10 h-12 border-gray-200"
              />
            </div>

            {/* Filter Icon */}
            <Button
              variant="outline"
              size="icon"
              className="h-12 w-12 border-gray-200"
            >
              <Filter className="w-5 h-5 text-gray-600" />
            </Button>

            {/* Filter Dropdown */}
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[150px] h-12 border-gray-200">
                <SelectValue placeholder="All Users" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="blocked">Blocked</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="bg-white">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 hover:bg-gray-50">
                <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  User
                </TableHead>
                <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Contact
                </TableHead>
                <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Join Date
                </TableHead>
                <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Orders
                </TableHead>
                <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </TableHead>
                <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <TableRow key={user.id} className="hover:bg-gray-50">
                    {/* User */}
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
                          style={{ backgroundColor: user.avatarColor }}
                        >
                          {getInitials(user.name)}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">
                            {user.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    {/* Contact */}
                    <TableCell className="text-gray-700">
                      {user.phone}
                    </TableCell>

                    {/* Join Date */}
                    <TableCell className="text-gray-700">
                      {user.joinDate}
                    </TableCell>

                    {/* Orders */}
                    <TableCell className="font-semibold text-gray-900">
                      {user.orders}
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <Badge
                        className={`${getStatusBadgeClass(user.status)} font-medium`}
                      >
                        {user.status}
                      </Badge>
                    </TableCell>

                    {/* Actions */}
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          <Eye className="h-5 w-5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className={`h-9 w-9 ${
                            user.status === "active"
                              ? "text-red-600 hover:text-red-700 hover:bg-red-50"
                              : "text-green-600 hover:text-green-700 hover:bg-green-50"
                          }`}
                        >
                          <UserX className="h-5 w-5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-12 text-gray-500"
                  >
                    No users found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default UsersListPage;

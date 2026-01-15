import AdminLayout from "./layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Trash2, MoreVertical, BookOpen } from "lucide-react";
import { MOCK_MANGA } from "@/lib/mock-data";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function AdminMangaList() {
  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Manage Manga</h1>
            <p className="text-muted-foreground">Add, edit, or remove manga series.</p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add New Series
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search manga..." 
              className="pl-9 bg-card border-white/10"
            />
          </div>
        </div>

        <div className="rounded-md border border-white/10 bg-card">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-white/5">
                <TableHead>Title</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Chapters</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_MANGA.map((manga) => (
                <TableRow key={manga.id} className="border-white/10 hover:bg-white/5">
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <img src={manga.cover} alt="" className="h-10 w-8 object-cover rounded" />
                      {manga.title}
                    </div>
                  </TableCell>
                  <TableCell>{manga.author}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={
                      manga.status === 'Ongoing' ? 'border-green-500 text-green-500' :
                      manga.status === 'Completed' ? 'border-blue-500 text-blue-500' :
                      'border-yellow-500 text-yellow-500'
                    }>
                      {manga.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{manga.rating}</TableCell>
                  <TableCell>{manga.chapters}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" /> Edit Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <BookOpen className="mr-2 h-4 w-4" /> Manage Chapters
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </AdminLayout>
  );
}

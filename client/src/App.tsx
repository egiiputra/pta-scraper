import './App.css'
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

function App() {
  return (
    <div className="w-screen">
      <div className="w-8/10 mx-auto">
        <h1 className="text-4xl mt-10 mb-5">Scraper Portal Tugas Akhir UTM </h1>

        <form action="" className="flex gap-3 items-center mb-5">
          <Label htmlFor="selectBy">Select by</Label>
          <Select name="selectBy">
            <SelectTrigger className="w-[280px] data-[placeholder]:text-muted-foreground" color="indigo">
              <SelectValue placeholder="select prodi or fakultas" />
            </SelectTrigger>
            <SelectContent className="bg-white text-black">
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>

          <Label htmlFor="startPage">page start</Label>
          <Select name="startPage" defaultValue="1">
            <SelectTrigger className="w-[80px]">
              <SelectValue placeholder="" />
            </SelectTrigger>
            <SelectContent className="bg-white text-black">
              {Array.from({ length: 20 }, (_, index) => index+1).map((val, _) =>
                <SelectItem value={val.toString()}>{val}</SelectItem>
              )}
            </SelectContent>
          </Select>

          <Label htmlFor="endPage">page end</Label>
          <Select name="endPage" defaultValue="1">
            <SelectTrigger className="w-[80px]">
              <SelectValue placeholder="" />
            </SelectTrigger>
            <SelectContent className="bg-white text-black">
              {Array.from({ length: 20 }, (_, index) => index+1).map((val, _) =>
                <SelectItem value={val.toString()}>{val}</SelectItem>
              )}
            </SelectContent>
          </Select>
          <Label>Include abstract?</Label>
          <Checkbox id="includeAbstract" name="includeAbstract"/>

          <Button type="submit">Scrape</Button>
        </form>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Invoice</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Method</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">INV001</TableCell>
              <TableCell>Paid</TableCell>
              <TableCell>Credit Card</TableCell>
              <TableCell className="text-right">$250.00</TableCell>
            </TableRow>
          </TableBody>
        </Table>

      </div>
    </div>
  )
}

export default App

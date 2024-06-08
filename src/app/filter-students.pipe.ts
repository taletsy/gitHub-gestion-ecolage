import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filterStudents',
    standalone: true,
})
export class FilterStudentsPipe implements PipeTransform {
    transform(items: any[], searchText: string): any[] {
        if (!items || !searchText) {
            return items;
        }
        searchText = searchText.toLowerCase();
        return items.filter(it => {
            return Object.keys(it).some(key => {
                return it[key].toString().toLowerCase().includes(searchText);
            });
        });
    }
}

// Test Debug Component for Book Requests
// Add this temporarily to any page to test database operations

import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';

export function DatabaseDebugger() {
  const { profile } = useAuth();
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const testOperations = async () => {
    setLoading(true);
    const testResults = [];

    try {
      // Test 1: Check if user profile exists
      testResults.push({ test: 'User Profile', result: profile ? 'EXISTS' : 'MISSING', data: profile });

      // Test 2: Try to read books
      const { data: books, error: booksError } = await supabase.from('books').select('*').limit(1);
      testResults.push({ 
        test: 'Read Books', 
        result: booksError ? 'ERROR' : 'SUCCESS', 
        data: booksError || books 
      });

      // Test 3: Try to read borrow_records
      const { data: records, error: recordsError } = await supabase.from('borrow_records').select('*').limit(1);
      testResults.push({ 
        test: 'Read Borrow Records', 
        result: recordsError ? 'ERROR' : 'SUCCESS', 
        data: recordsError || records 
      });

      // Test 4: Try to create a test borrow request
      if (profile?.id && books && books.length > 0) {
        const { data: testRequest, error: insertError } = await supabase
          .from('borrow_records')
          .insert([{
            user_id: profile.id,
            book_id: books[0].id,
            due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'requested',
            requested_date: new Date().toISOString()
          }])
          .select()
          .single();

        testResults.push({ 
          test: 'Create Test Request', 
          result: insertError ? 'ERROR' : 'SUCCESS', 
          data: insertError || testRequest 
        });

        // Clean up - delete test request
        if (testRequest) {
          await supabase.from('borrow_records').delete().eq('id', testRequest.id);
        }
      }

      setResults(testResults);
    } catch (error) {
      testResults.push({ test: 'Global Error', result: 'ERROR', data: error });
      setResults(testResults);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border border-red-500 bg-red-50 rounded">
      <h3 className="font-bold text-red-800 mb-2">🐛 Database Debugger</h3>
      <Button onClick={testOperations} disabled={loading} className="mb-4">
        {loading ? 'Testing...' : 'Run Database Tests'}
      </Button>
      
      <div className="space-y-2">
        {results.map((result, index) => (
          <div key={index} className="p-2 bg-white rounded border">
            <div className="flex justify-between items-center">
              <span className="font-medium">{result.test}</span>
              <span className={`px-2 py-1 rounded text-xs ${
                result.result === 'SUCCESS' ? 'bg-green-100 text-green-800' : 
                result.result === 'ERROR' ? 'bg-red-100 text-red-800' : 
                'bg-gray-100 text-gray-800'
              }`}>
                {result.result}
              </span>
            </div>
            <pre className="text-xs mt-1 bg-gray-100 p-1 rounded overflow-auto max-h-20">
              {JSON.stringify(result.data, null, 2)}
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
}
